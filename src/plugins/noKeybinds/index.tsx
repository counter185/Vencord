/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    disableCallStart: {
        type: OptionType.BOOLEAN,
        description: "Disable CALL_START (Ctrl+', Ctrl+Shift+')",
        default: true
    },
    disableCallAccept: {
        type: OptionType.BOOLEAN,
        description: "Disable CALL_ACCEPT (Ctrl+Enter)",
        default: false
    },
    disableCreatePrivateMessage: {
        type: OptionType.BOOLEAN,
        description: "Disable TOGGLE_DM_CREATE (Ctrl+Shift+T)",
        default: false
    },
    disableEmojiPopout: {
        type: OptionType.BOOLEAN,
        description: "Disable TOGGLE_EMOJI_POPOUT (Ctrl+E)",
        default: false
    },
    disableStickerPicker: {
        type: OptionType.BOOLEAN,
        description: "Disable TOGGLE_STICKER_PICKER (Ctrl+S)",
        default: false
    },
    disableGifPicker: {
        type: OptionType.BOOLEAN,
        description: "Disable TOGGLE_GIF_PICKER (Ctrl+G)",
        default: false
    },
    disableHelpWindow: {
        type: OptionType.BOOLEAN,
        description: "Disable Help window (Ctrl+Shift+H / F1)",
        default: true
    }
});

export default definePlugin({
    name: "DisableDefaultKeybinds",
    description: "This plugin lets you disable some of the default keybinds",
    settings: settings,
    authors: [{
        name: "cntrpl",
        id: 212160419769483265n
    }],

    patches: [
        {
            find: "\"ctrl+shift+'\"",
            replacement: {
                match: /(?<=if\s*\(\i\.\i\.hasSubscribers\((\i\.\i\.CALL_START)\)\))\s*return/,
                replace: "return $self.checkKeybindDisabled($1) ? null :"
            }
        },
        {
            find: "\"ctrl+shift+'\"",
            replacement: {
                match: /(?<=if\s*\(\i\.\i\.hasSubscribers\((\i\.\i\.CALL_ACCEPT)\)\))\s*return/,
                replace: "return $self.checkKeybindDisabled($1) ? null :"
            }
        },
        {
            find: "[\"mod+shift+h\"",
            replacement: {
                match: /(?<=action:\s*\(\)\s*=>)\s*(?=\(window\.open)/,
                replace: "$self.checkKeybindDisabled(\"help_window\") ? null :"
            }
        },

        // general event hooks below
        {
            find: "this.emitter.setMaxListeners(",
            replacement: {
                match: /(?<=safeDispatch\((\i)\)\s*{)\s*(?=.*this.hasSubscribers)/,
                replace: "if ($self.checkKeybindDisabled($1)) return;"
            }
        },
        {
            find: "this.emitter.setMaxListeners(",
            replacement: {
                match: /(?<=dispatch\((\i),\s*\i\)\s*{)\s*(?=.*this.emitter.listeners\()/,
                replace: "if ($self.checkKeybindDisabled($1)) return;"
            }
        },
        {
            find: "this.emitter.setMaxListeners(",
            replacement: {
                match: /(?<=dispatchToLastSubscribed\((\i),\s*\i\)\s*{)\s*(?=.*this.emitter.listeners\()/,
                replace: "if ($self.checkKeybindDisabled($1)) return;"
            }
        }
    ],
    start() {

    },
    stop() {

    },

    checkKeybindDisabled(name) {
        // console.log("checkKeybindDisabled: " + name);     //uncomment to print event names to console and add your own
        var settingsMap = {
            "CALL_START": settings.store.disableCallStart,
            "CALL_ACCEPT": settings.store.disableCallAccept,
            "TOGGLE_DM_CREATE": settings.store.disableCreatePrivateMessage,
            "TOGGLE_EMOJI_POPOUT": settings.store.disableEmojiPopout,
            "TOGGLE_STICKER_PICKER": settings.store.disableStickerPicker,
            "TOGGLE_GIF_PICKER": settings.store.disableGifPicker,
            "help_window": settings.store.disableHelpWindow
        };
        var value = settingsMap[name];
        return value === undefined ? false : value;
    }
});
