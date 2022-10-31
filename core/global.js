import { setVueGlobDirectives } from "./plugin/index.js";
import { setVueRouterEvent } from "./event.js";
import { cConsole } from "./utils.js";
import { defaultOptions } from './type.js'

const filterParams = function(data) {
  Object.keys(data).forEach(key => {
    if(defaultOptions[key] !== undefined) {
      delete data[key];
    }
  })
  return data;
}

const xmlHttpRequest = function (url, data) {
  const params = filterParams(data);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.send(JSON.stringify(params));
};

const trackingToPageParams = (id) => {
  id = id.toString();
  if (!id && id.length < 2) return {};
  const page_type = id.slice(0, 1);
  const page_id = id.slice(1);
  return {
    page_type,
    page_id,
  };
};

const getheatMap = (x, y) => {
  return `${x}.${y}`;
};

function extend(target, source) {
  for (var obj in source) {
    if (target[obj]) {
      target[obj] = source[obj];
    }
  }
  return target;
}

export const dvRequest = function (options) {
  const params = JSON.parse(localStorage.getItem("fspace-tracker")) || null;
  if (!params) return;
  const { url, enableHeatMap } = params;
  let position = "";
  if(enableHeatMap && options.x && options.y) {
    position = getheatMap(options.x, options.y);
    delete options.x
    delete options.y
  }
  const defaultData = {
    ...params,
    ...options,
    position,
    ...trackingToPageParams(options.tracking),
  };
  xmlHttpRequest(url, defaultData);
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
      debug: this._options.debug
    });
    xmlHttpRequest(this._options.url, defaultData);
  };

  FSTracker.prototype.initDirectives = function (app) {
    setVueGlobDirectives(app);
  };

  FSTracker.prototype.registerVueRouterEvent = function (router, cb) {
    setVueRouterEvent(router, this._options, cb);
  };
}
