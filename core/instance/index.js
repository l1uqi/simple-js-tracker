import { initMixin } from "./init.js";
import { initGlobalFun } from '../global/index.js';

function FSTracker(options) {
  // 初始化sdk
  this._init(options);
}

initMixin(FSTracker);

initGlobalFun(FSTracker);

export default FSTracker;
