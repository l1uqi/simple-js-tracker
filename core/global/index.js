import { setTrackDirectives } from './directives.js'
import { setVueRouterEvent } from "../instance/event.js";
import { sendTracker } from './http.js';

export function initGlobalFun(FSTracker) {
  FSTracker.prototype.setConfig = function (options) {
    options = Object.assign({}, this._options, options);
    localStorage.setItem("fspace-tracker", JSON.stringify(options));
  };

  FSTracker.prototype.sendTracker = function(data = {}) {
    sendTracker(this._options, data)
  };

  FSTracker.prototype.initDirectives = function (app) {
    setTrackDirectives(app);
  };

  FSTracker.prototype.registerVueRouterEvent = function (router, cb) {
    setVueRouterEvent(router, this._options, cb);
  };
}
