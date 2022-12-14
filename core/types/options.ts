export interface IDefaultOptions {
  debug?: boolean,

  url: string, // 埋点请求后端接口

  method?: string,

  config?: object | null | undefined,

  enableDecorator?: boolean, // 开启装饰器

  enableHeatMap?: boolean,

  enableHashTracker?: boolean,

  enableVisibilitychange?: boolean

  timeout?: number

  [key: string]: boolean | string | number | object | null | undefined,
};


export interface ICustomOptions {
  [key: string]: boolean | string | number | object | null | undefined ,
}