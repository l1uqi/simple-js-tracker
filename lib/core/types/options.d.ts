export interface IDefaultOptions {
    debug?: boolean;
    url: string;
    method?: string;
    config?: object | null | undefined;
    enableDecorator?: boolean;
    enableHeatMap?: boolean;
    enableHashTracker?: boolean;
    enableVisibilitychange?: boolean;
    [key: string]: boolean | string | object | null | undefined;
}
export interface ICustomOptions {
    [key: string]: boolean | string | object | null | undefined;
}
