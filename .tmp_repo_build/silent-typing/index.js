import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/// <reference path="../../valenced.d.ts" />
import { onFluxEventDispatched } from '@valenced/discord/flux';
import { after } from '@valenced/patcher';
import { findInReactFiber } from '@valenced/utils/react';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DefaultSettings } from './shared';
import SettingsComponent from './settings';
let storage;
plugin({
    jsonStorage: {
        load: true,
        default: DefaultSettings,
    },
    start({ cleanup, jsonStorage }) {
        storage = jsonStorage;
        cleanup(onFluxEventDispatched('TYPING_START_LOCAL', payload => {
            if (storage.cache?.enabled ?? DefaultSettings.enabled)
                return;
            return payload;
        }), after('modules/chat_input/native/action_buttons/ChatInputActions.tsx', tree => {
            insertButton(tree, storage.cache?.button ?? DefaultSettings.button);
        }));
    },
    SettingsComponent,
});
const button = _jsx(SilentTypingButton, {}, "silent-typing");
function insertButton(tree, side) {
    const node = findInReactFiber(tree, (node) => Array.isArray(node.props?.children));
    if (!node)
        return tree;
    const { children } = node.props;
    const index = children.indexOf(button);
    if (index !== -1)
        children.splice(index, 1);
    if (side !== 'none') {
        if (side === 'left')
            children.push(button);
        else
            children.unshift(button);
    }
    return tree;
}
function SilentTypingButton() {
    const { enabled } = { ...DefaultSettings, ...storage.use() };
    const [ChatInputActionButton, setChatInputActionButton] = useState(null);
    useEffect(() => {
        if (ChatInputActionButton)
            return;
        const nextButton = globalThis.Discord?.ChatInputActionButton ?? null;
        setChatInputActionButton(nextButton);
    }, [ChatInputActionButton]);
    if (!ChatInputActionButton)
        return null;
    const keyboardIcon = globalThis.Discord?.KeyboardIcon ?? null;
    if (!keyboardIcon)
        return null;
    return (_jsx(ChatInputActionButton, { accessibilityLabel: enabled ? 'Disable silent typing' : 'Enable silent typing', accessibilityState: { checked: enabled }, IconComponent: enabled ? KeyboardOffIcon : keyboardIcon, onPress: () => storage.set({ enabled: !enabled }) }));
}
function KeyboardOffIcon(props) {
    const styles = useStyles();
    const { width = 24, height = 24 } = (StyleSheet.flatten(props.style ?? {}) ?? {});
    const length = Math.hypot(width, height) * 0.85;
    const slashHeight = 2 + 2 * 2;
    return (_jsxs(View, { children: [_jsx(View, { style: styles.iconFallback }), _jsx(View, { style: [
                    styles.slash,
                    {
                        width: length,
                        height: slashHeight,
                        top: (height - slashHeight) / 2,
                        left: (width - length) / 2,
                    },
                ] })] }));
}
const useStyles = () => ({
    iconFallback: { width: 24, height: 24 },
    slash: {
        position: 'absolute',
        backgroundColor: '#ff4d4f',
        borderWidth: 2,
        borderColor: '#1e1f22',
        borderRadius: 4,
        transform: [{ rotate: '-45deg' }],
    },
});
