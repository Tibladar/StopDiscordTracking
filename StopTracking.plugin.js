/**
 * @name StopTracking
 * @author Tibladar
 * @description Stops Discord tracking
 * @source https://github.com/Tibladar/StopDiscordTracking
 * @updateUrl https://raw.githubusercontent.com/Tibladar/StopDiscordTracking/main/StopTracking.plugin.js
 * @version 0.0.1
 */
Object.defineProperty(exports, '__esModule', { value: true });
class StopTracking {
    start() {
        (function() {
            let origSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function(data) {
                let url = this.__sentry_xhr__.url;
                let popit = url.split('/').pop().split('?')[0];
                if (['science'].includes(popit)) {
                    //console.log(popit + ' has been blocked');
                    return false;
                }
                let newurl = new URL(url).hostname;
                if (['sentry.io'].includes(newurl)) {
                    //console.log(newurl + ' has been blocked');
                    return false;
                }
                return origSend.apply(this, arguments);
            };


            let origsetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
            XMLHttpRequest.prototype.setRequestHeader = function(data) {
                if (['X-Track', 'X-Super-Properties', 'X-Fingerprint'].includes(arguments[0])) {
                    //console.log(arguments[0] + ' has been stripped');
                    return false;
                }
                return origsetRequestHeader.apply(this, arguments);
            };

        })();
    }
    stop() {
        if (this.unpatch) {
            this.unpatch();
        }
    }
}
exports.default = StopTracking;