import { IDefaultOptions, ISimpleJsTracker } from "../types/index";
import { initMixin } from "./init";

// function SimpleJsTracker(this: ISimpleJsTracker, options: IDefaultOptions): ISimpleJsTracker  {
//   // 初始化sdk
//   this._init(options);
  
//   return this;
// }

class SimpleJsTracker {
  constructor(options: IDefaultOptions) {
    this['_init'](options);
  }
}

initMixin(SimpleJsTracker);

export default SimpleJsTracker;
