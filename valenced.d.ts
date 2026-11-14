declare module '@valenced/discord/flux' {
  export function onFluxEventDispatched<T extends object = Record<string, any>>(
    type: string,
    patch: (payload: T) => T | void | undefined,
  ): () => void
}

declare module '@valenced/discord/design' {
  export const Design: {
    Stack: (props: any) => any
    TableRowGroup: (props: any) => any
    TableSwitchRow: (props: any) => any
    TableRadioGroup: (props: any) => any
    TableRadioRow: (props: any) => any
    createStyles: (styles: any) => any
  }
}

declare module '@valenced/components/Page' {
  const Page: (props: any) => any
  export default Page
}

declare module '@valenced/components/TableRowAssetIcon' {
  const TableRowAssetIcon: (props: any) => any
  export default TableRowAssetIcon
}

declare module '@valenced/plugins/types' {
  export type PluginSettingsComponent<T> = (props: { api: { jsonStorage: any } }) => any
}

declare module '@valenced/patcher' {
  export function after(path: string, callback: (tree: any) => any): () => void
}

declare module '@valenced/utils/react' {
  export function findInReactFiber(tree: any, predicate: (node: any) => boolean): any
}

declare module '@valenced/json-storage' {
  export type JsonStorage<T> = {
    cache?: T
    use: (selector?: (value: T) => any) => T
    set: (value: Partial<T> | T) => void
  }
}

declare module 'react' {
  export function useEffect(effect: any, deps?: any[]): void
  export function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void]
  export type FC<P = any> = (props: P) => any
  export type ReactElement = any
  export type ReactNode = any
  export type ComponentProps<T> = T extends (props: infer P) => any ? P : any
}

declare module 'react-native' {
  export type ImageStyle = any
  export type StyleProp<T> = T | undefined
  export const StyleSheet: {
    flatten: (value: any) => any
  }
  export const View: any
}

declare module 'react/jsx-runtime' {
  export const Fragment: any
  export function jsx(type: any, props: any, key?: any): any
  export function jsxs(type: any, props: any, key?: any): any
}

type JsonStorageLike<T> = {
  cache?: T
  use: () => T | undefined
  set: (value: T) => void
}

type PluginLogger = {
  log: (...args: any[]) => void
}

type PluginCleanup = (...callbacks: Array<(() => void) | undefined | null>) => void

type PluginContext<T> = {
  cleanup: PluginCleanup
  jsonStorage: JsonStorageLike<T>
  logger: PluginLogger
}

type PluginApi<T> = {
  jsonStorage: JsonStorageLike<T>
}

type PluginDefinition<TSettings> = {
  jsonStorage?: {
    load?: boolean
    default?: TSettings
  }
  start?: (context: PluginContext<TSettings>) => void
  SettingsComponent?: (props: { api: PluginApi<TSettings> }) => any
}

declare function plugin<TSettings>(config: PluginDefinition<TSettings>): PluginDefinition<TSettings>

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}
