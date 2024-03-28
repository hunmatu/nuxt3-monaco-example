export interface UIComponent {
    x: number,
    y: number,
    name: string,
    props: UICProp[]
    // type: string | undefined
}
export interface UICProp {
    key: string,
    value: any,
    type: string,
    selectableValues: []
}

// 提案リスト
export interface UICSuggest {
    label: string,
    name: string,
    match: number,
    uiType: string,
} 