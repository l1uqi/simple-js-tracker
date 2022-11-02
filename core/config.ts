import { IDefaultOptions } from "./types/index";

export const defaultOptions: IDefaultOptions = {
  debug: false,

  url: '', // 埋点请求后端接口

  method: 'GET',

  config: null,

  enableDecorator: false, // 开启装饰器

  enableHeatMap: false,

  enableHashTracker: false
}