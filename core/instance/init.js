import { defaultOptions } from "../types/index.js";
import { initHashEvent } from './event.js';
import { setDecorator } from '../decorator.js'

function _setConfig(fs, options) {
  const { config } = options;
  delete options.config
  options = Object.assign(config, defaultOptions, options);
  fs._options = options;
  localStorage.setItem('fspace-tracker',JSON.stringify(options))
}


function _initEvent(fs, options) {
  // 开始hash router 监听
  if(options.enableHashTracker) {
    initHashEvent(fs, options)
  }
}

function _initDecorator() {
  setDecorator();
}

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
