import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/// <reference path="../../valenced.d.ts" />
import Page from '@valenced/components/Page';
import TableRowAssetIcon from '@valenced/components/TableRowAssetIcon';
import { Design } from '@valenced/discord/design';
import { DefaultSettings } from './shared';
const { Stack, TableRadioGroup, TableRadioRow, TableRowGroup, TableSwitchRow } = Design;
export default function SettingsComponent({ api: { jsonStorage: storage }, }) {
    const { enabled, button } = { ...DefaultSettings, ...storage.use() };
    return (_jsx(Page, { children: _jsxs(Stack, { spacing: 24, children: [_jsx(TableRowGroup, { children: _jsx(TableSwitchRow, { icon: _jsx(TableRowAssetIcon, { name: "KeyboardIcon" }), label: "Silent typing", subLabel: "Hide your typing indicator from others.", value: enabled, onValueChange: (enabled) => storage.set({ enabled }) }) }), _jsxs(TableRadioGroup, { title: "Toggle Button", defaultValue: button, onChange: (button) => storage.set({ button }), children: [_jsx(TableRadioRow, { label: "Hidden", value: "none" }), _jsx(TableRadioRow, { label: "Left", subLabel: "Next to the attachments button.", value: "left" }), _jsx(TableRadioRow, { label: "Right", subLabel: "Next to the emoji button.", value: "right" })] })] }) }));
}
