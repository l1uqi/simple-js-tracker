import { setTrackV2Directives } from "./directives_v2";
import { initErrorEvent, setVueRouterEvent } from "../instance/event";
import { sendTracker } from "./http";
import { compareVersion, getCache, setCache } from "../utils/index";
import { setTrackV3Directives } from "./directives_v3";
import { sessionStoreEnum } from "../enum";

export function initGlobalFun(SJTracker) {
  SJTracker.prototype.setConfig = function (options) {
    options = Object.assign({}, this._options, options);
    this._options = options;
    setCache(sessionStoreEnum.OPSIONS, options);
  };

  SJTracker.prototype.sendTracker = function (data = {}) {
    sendTracker(this._options, data);
  };

  SJTracker.prototype.initDirectives = function (app) {
    if (app.version && compareVersion("3.0.0", app.version) > 0) {
      setTrackV2Directives(app);
    } else {
      setTrackV3Directives(app);
    }
  };

  SJTracker.prototype.registerVueRouterEvent = function (router, cb) {
    setVueRouterEvent(router, this._options, cb);
  };

  SJTracker.prototype.getUUID = function () {
    return getCache(sessionStoreEnum.UUID);
  };

  SJTracker.prototype.registerErrorEvent = function (cb) {
    initErrorEvent(cb);
  };


}
