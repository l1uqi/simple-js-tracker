import { defaultOptions } from "../config";
import { LocalStoreEnum } from "../enum";
import { IDefaultOptions } from "../types/index";
import { setCache, initParamsConsole } from "../utils/index";
import { initHashEvent } from "./event";

function _setConfig(fs, options: IDefaultOptions) {
  const { config } = options;
  initParamsConsole(options);
  if (typeof config === "object" && config != null) {
    options = Object.assign(config, defaultOptions, options);
  }
  delete options["config"];
  fs._options = options;
  setCache(LocalStoreEnum.OPSIONS, options);
}

function _initEvent(fs, options) {
  // 开始hash router 监听
  if (options.enableHashTracker) {
    initHashEvent(fs, options);
  }
}

function _initDecorator() {}

export function initMixin(FSTracker) {
  FSTracker.prototype._init = function (options) {
    const fs = this;
    if (options) {
      _setConfig(fs, options);
      _initEvent(fs, options);
      _initDecorator();
    }
  };
}
