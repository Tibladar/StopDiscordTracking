/**
 * @name StopTracking
 * @author Tibladar
 * @description Stops Discord tracking
 * @source https://github.com/Tibladar/StopDiscordTracking
 * @updateUrl https://raw.githubusercontent.com/Tibladar/StopDiscordTracking/main/StopTracking.plugin.js
 * @version 0.0.9
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
const config = {
    name: "StopTracking",
    author: "Tibladar",
    version: "0.0.9",
    description: "Stops Discord tracking",
    github: "https://github.com/Tibladar/StopDiscordTracking",
    github_raw: "https://raw.githubusercontent.com/Tibladar/StopDiscordTracking/main/StopTracking.plugin.js",
    changelog: [
        {
            title: "What's New?",
            type: "added",
            items: [
                "Added auto updater",
                "/metrics endpoint now gets blocked"
            ]
        },
        {
            title: "Bug Fixes",
            type: "fixed",
            items: [
                "Disabling the plugin now removes the tracking protection",
            ]
        }
    ],
    main: "index.js"
};
class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.name ?? config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
                if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                if (resp.statusCode === 302) {
                    require("request").get(resp.headers.location, async (error, response, content) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
                    });
                }
                else {
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                }
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin]) => {
    const plugin = (Plugin) => {

        const pathsToBlock = ['science', 'metrics'];
        const domainsToBlock = ['sentry.io'];
        const headersToStrip = ['X-Track', 'X-Fingerprint'];

        const origOpen = XMLHttpRequest.prototype.open;
        const origSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

        return class StopTracking extends Plugin {

            onStart() {
                this.patchXMLHTTPRequests();
            }

            onStop() {
                this.unpatchXMLHTTPRequests();
            }

            patchXMLHTTPRequests() {
                XMLHttpRequest.prototype.open = function(method, url, async) {
                    let path = url.split('/').pop().split('?')[0];
                    if (pathsToBlock.includes(path)) {
                        //console.log(path + ' has been blocked');
                        return false;
                    }
                    let hostname = new URL(url).hostname;
                    if (domainsToBlock.includes(hostname)) {
                        return false;
                    }
                    return origOpen.apply(this, arguments);
                };

                XMLHttpRequest.prototype.setRequestHeader = function(data) {
                    if (headersToStrip.includes(arguments[0])) {
                        //console.log(arguments[0] + ' has been stripped');
                        return false;
                    }
                    return origSetRequestHeader.apply(this, arguments);
                };
            }

            unpatchXMLHTTPRequests() {
                XMLHttpRequest.prototype.open = origOpen;
                XMLHttpRequest.prototype.setRequestHeader = origSetRequestHeader;
            }

        };
    };
    return plugin(Plugin);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/
