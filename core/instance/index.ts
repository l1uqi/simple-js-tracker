import { IDefaultOptions, ISimpleJsTracker } from "../types/index";
import { initMixin } from "./init";
import Interceptor from "./interceptor";

class SimpleJsTracker {
  constructor(options: IDefaultOptions) {
    this['_init'](options);
    this['interceptors'] = {
      sendTracker: new Interceptor()
    }
  }
}

initMixin(SimpleJsTracker);

export default SimpleJsTracker;
