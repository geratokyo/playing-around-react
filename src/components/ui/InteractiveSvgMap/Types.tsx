
export interface Dictionary<T> {
    [idx: string]: T;
}

export interface iStylesMod {
    attr: string;
    valueEnabled: string;
    valueDisabled: string;
    valueDefault: string;
    transition?: string;
}

export interface iTooltipElement {
    className?: string;
    height?: number;
    width?: number;
    top?: number;
    left?: number;
    transition?: string;
    cursorBased?: boolean;
    element?: React.ReactElement;
}