# StopDiscordTracking

## Overview

This is a BetterDiscord plugin for stopping Discord tracking

## Installation

- Download the plugin [StopTracking.plugin.js](https://raw.githubusercontent.com/Tibladar/StopDiscordTracking/main/StopTracking.plugin.js) (Ctrl+S)
- Open your plugins folder: BetterDiscord Settings -> Plugins -> Click on the button next to the heading
- Move the downloaded file there
- Activate the plugin in the BetterDiscord plugin menu

## Updating

There is an updater that displays a notification when an update is released:

![update notice](https://github.com/Tibladar/StopDiscordTracking/assets/52620063/5537f12a-7290-4c5c-83e9-d40cea206301)

## Technical details

The plugin
- blocks requests to the [/science](https://github.com/KhafraDev/discord-verify/wiki/Trackers#apiv6science) and /metrics endpoint
- blocks requests to sentry.io
- removes tracking headers like ~~['X-Super-Properties'](https://github.com/KhafraDev/discord-verify/wiki/X-Super-Properties#x-super-properties)~~, 'X-Track', and 'X-Fingerprint'

## FAQ

#### How can I verify this addon works?
You can open the developer console (after you activated it in BetterDiscord settings) and look at the 'Network' tab.
There shouldn't be any requests made to the science endpoint.

For checking the headers, click on any non-asset (e.g. no image) request and look at the bottom of 'Request Headers'.
There shouldn't be the headers mentioned above.

#### Will it be featured on betterdiscord.app?
Probably not as this plugin modifies global functions which is prohibited in the [Plugin Guidelines](https://docs.betterdiscord.app/plugins/introduction/guidelines/#code).

#### Is this the same as 'DoNotTrack' from Zerebos?
No, this plugin
- does **not** block the Process Monitor.
- does block request headers, which 'DoNotTrack' doesn't.
