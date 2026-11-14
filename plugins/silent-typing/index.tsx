/// <reference path="../../valenced.d.ts" />

import { onFluxEventDispatched } from '@valenced/discord/flux'
import { after } from '@valenced/patcher'
import { findInReactFiber } from '@valenced/utils/react'
import type { JsonStorage } from '@valenced/json-storage'
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { DefaultSettings, type Settings } from './shared'
import SettingsComponent from './settings'
import type { FC, ReactElement, ReactNode } from 'react'
import type { ImageStyle, StyleProp } from 'react-native'

let storage: JsonStorage<Settings>

export default plugin<Settings>({
    jsonStorage: {
        load: true,
        default: DefaultSettings,
    },
    start({ cleanup, jsonStorage }) {
        storage = jsonStorage as JsonStorage<Settings>

        cleanup(
            onFluxEventDispatched('TYPING_START_LOCAL', payload => {
                if (storage.cache?.enabled ?? DefaultSettings.enabled) return
                return payload
            }),
            after('modules/chat_input/native/action_buttons/ChatInputActions.tsx', tree => {
                insertButton(tree as ReactElement, storage.cache?.button ?? DefaultSettings.button)
            }),
        )
    },
    SettingsComponent,
})

const button = <SilentTypingButton key="silent-typing" />

function insertButton(tree: ReactElement, side: Settings['button']) {
    const node = findInReactFiber(
        tree,
        (node): node is { props: { children: ReactNode[] } } => Array.isArray(node.props?.children),
    )

    if (!node) return tree

    const { children } = node.props
    const index = children.indexOf(button)
    if (index !== -1) children.splice(index, 1)

    if (side !== 'none') {
        if (side === 'left') children.push(button)
        else children.unshift(button)
    }

    return tree
}

function SilentTypingButton() {
    const { enabled } = { ...DefaultSettings, ...storage.use() }
    const [ChatInputActionButton, setChatInputActionButton] = useState<FC<any> | null>(null)

    useEffect(() => {
        if (ChatInputActionButton) return

        const nextButton = (globalThis as any).Discord?.ChatInputActionButton ?? null
        setChatInputActionButton(nextButton)
    }, [ChatInputActionButton])

    if (!ChatInputActionButton) return null

    const keyboardIcon = (globalThis as any).Discord?.KeyboardIcon ?? null
    if (!keyboardIcon) return null

    return (
        <ChatInputActionButton
            accessibilityLabel={enabled ? 'Disable silent typing' : 'Enable silent typing'}
            accessibilityState={{ checked: enabled }}
            IconComponent={enabled ? KeyboardOffIcon : keyboardIcon}
            onPress={() => storage.set({ enabled: !enabled })}
        />
    )
}

function KeyboardOffIcon(props: IconProps) {
    const styles = useStyles()
    const { width = 24, height = 24 } = (StyleSheet.flatten(props.style ?? {}) ?? {}) as ImageStyle & {
        width?: number
        height?: number
    }
    const length = Math.hypot(width, height) * 0.85
    const slashHeight = 2 + 2 * 2

    return (
        <View>
            <View style={styles.iconFallback} />
            <View
                style={[
                    styles.slash,
                    {
                        width: length,
                        height: slashHeight,
                        top: (height - slashHeight) / 2,
                        left: (width - length) / 2,
                    },
                ]}
            />
        </View>
    )
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
})

interface IconProps {
    style?: StyleProp<ImageStyle>
}