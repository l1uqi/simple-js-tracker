import SimpleJsTracker from ".";
import { defaultOptions } from "../config";
import { sessionStoreEnum } from "../enum";
import { IDefaultOptions, ISimpleJsTracker } from "../types/index";
import { setCache, initParamsConsole, GenNonDuplicateID } from "../utils/index";
import { initErrorEvent, initHashEvent } from "./event";

function _setConfig(fs, options: IDefaultOptions) {
  const { config } = options;
  initParamsConsole(options);
  if (typeof config === "object" && config != null) {
    options = Object.assign(config, defaultOptions, options);
  }
  delete options["config"];
  fs._options = options;
  const uuid = GenNonDuplicateID();
  setCache(sessionStoreEnum.OPSIONS, options);
  setCache(sessionStoreEnum.UUID, uuid);
}

function _initEvent(fs, options) {
  // 开始hash router 监听
  if (options.enableHashTracker) {
    initHashEvent(fs, options);
  }
}

function _initError(options) {
  initErrorEvent(options)
}

function _initDecorator() {}

export function initMixin(simpleJsTracker ) {
  simpleJsTracker.prototype._init = function (options) {
    const fs = this;
    if (options) {
      _setConfig(fs, options);
      _initEvent(fs, options);
      _initDecorator();
    }
  };
}
