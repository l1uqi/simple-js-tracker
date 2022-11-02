import { setTrackV2Directives } from "./directives_v2";
import { setVueRouterEvent } from "../instance/event";
import { sendTracker } from "./http";
import { compareVersion, setCache } from "../utils/index";
import { setTrackV3Directives } from "./directives_v3";

export function initGlobalFun(FSTracker) {
  FSTracker.prototype.setConfig = function (options) {
    options = Object.assign({}, this._options, options);
    setCache("options", options);
  };

  FSTracker.prototype.sendTracker = function (data = {}) {
    sendTracker(this._options, data);
  };

  FSTracker.prototype.initDirectives = function (app) {
    if (app.version && compareVersion("3.0.0", app.version) > 0) {
      setTrackV2Directives(app);
    } else {
      setTrackV3Directives(app);
    }
  };

  FSTracker.prototype.registerVueRouterEvent = function (router, cb) {
    setVueRouterEvent(router, this._options, cb);
  };
}
