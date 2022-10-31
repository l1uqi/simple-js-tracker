import { initMixin } from "./init.js";
import { initGlobalFun } from './global.js';

/**
 * 初始化埋点sdk
 * @param {*} options
 */
function FSTracker(options) {
  this._init(options);
}

initMixin(FSTracker);

initGlobalFun(FSTracker);

export default FSTracker;
