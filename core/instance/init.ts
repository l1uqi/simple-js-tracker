import { defaultOptions } from "../config";
import { IDefaultOptions } from "../types/index";
import { setCache } from '../utils/index';
import { initHashEvent } from './event';

function _setConfig(fs, options: IDefaultOptions) {
  const { config } = options;
  delete options['config']
  if(typeof config === 'object' && config != null) {
    options = Object.assign(config, defaultOptions, options);
  }
  
  fs._options = options;
  setCache('options', options);
}


function _initEvent(fs, options) {
  // 开始hash router 监听
  if(options.enableHashTracker) {
    initHashEvent(fs, options)
  }
}

function _initDecorator() {

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
