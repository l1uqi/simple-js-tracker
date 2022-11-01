import { setVueGlobDirectives } from "./plugin/index.js";
import { setVueRouterEvent } from "./instance/event.js";
import { cConsole, getheatMap } from "./utils/index.js";
import { report } from "./report.js";

export const dvReport = function (options) {
  const params = JSON.parse(localStorage.getItem("fspace-tracker")) || null;
  if (!params) return;
  const { url, enableHeatMap } = params;
  let position = "";
  if (enableHeatMap && options.x && options.y) {
    position = getheatMap(options.x, options.y);
    delete options.x;
    delete options.y;
  }
  const defaultData = {
    ...params,
    ...options,
    position,
  };
  cConsole({
    text: defaultData,
    debug: params.debug
  });
  report(url, params.method, defaultData);
};

export function initGlobalFun(FSTracker) {
  FSTracker.prototype.setConfig = function (options) {
    options = Object.assign({}, this._options, options);
    localStorage.setItem("fspace-tracker", JSON.stringify(options));
  };

  FSTracker.prototype.sendTracker = function (data = {}) {
    const defaultData = {
      ...this._options,
      ...data,
    };

    cConsole({
      text: data,
      debug: this._options.debug,
    });
    report(this._options.url, this._options.method, defaultData);
  };

  FSTracker.prototype.initDirectives = function (app) {
    setVueGlobDirectives(app);
  };

  FSTracker.prototype.registerVueRouterEvent = function (router, cb) {
    setVueRouterEvent(router, this._options, cb);
  };
}
