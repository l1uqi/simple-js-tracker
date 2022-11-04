(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SimpleJsTracker = factory());
})(this, (function () { 'use strict';

  const defaultOptions = {
      debug: false,
      url: '',
      method: 'GET',
      config: null,
      enableDecorator: false,
      enableHeatMap: false,
      enableHashTracker: false
  };

  var LocalStoreEnum;
  (function (LocalStoreEnum) {
      LocalStoreEnum["OPSIONS"] = "OPSIONS";
      LocalStoreEnum["PRE_TIMESTAMP"] = "PRE_TIMESTAMP";
      LocalStoreEnum["PAGE_PERFORMANCE"] = "PAGE_PERFORMANCE";
      LocalStoreEnum["PAGE_INFO"] = "PAGE_INFO";
  })(LocalStoreEnum || (LocalStoreEnum = {}));

  const basicKey = "SIMPLE_JS_TRACKER";
  const getCache = (key) => {
      const _key = basicKey + key;
      const cache = localStorage.getItem(_key);
      if (cache) {
          return JSON.parse(cache);
      }
      return null;
  };
  const setCache = (key, value) => {
      if (value === undefined)
          value = null;
      const _key = basicKey + key;
      if (typeof value !== 'string') {
          value = JSON.stringify(value);
      }
      localStorage.setItem(_key, value);
  };

  const filterParams = function (data) {
      Object.keys(data).forEach((key) => {
          if (defaultOptions[key] !== undefined) {
              delete data[key];
          }
      });
      return data;
  };
  const getheatMap = (x, y) => {
      return `${x}.${y}`;
  };
  const urlIsLong = (url) => {
      let totalLength = 0, charCode = 0;
      for (var i = 0; i < url.length; i++) {
          charCode = url.charCodeAt(i);
          if (charCode < 0x007f) {
              totalLength++;
          }
          else if (0x0080 <= charCode && charCode <= 0x07ff) {
              totalLength += 2;
          }
          else if (0x0800 <= charCode && charCode <= 0xffff) {
              totalLength += 3;
          }
      }
      return totalLength < 2000 ? false : true;
  };
  const compareVersion = (version1, version2) => {
      const arr1 = version1.split('.');
      const arr2 = version2.split('.');
      const length1 = arr1.length;
      const length2 = arr2.length;
      const minlength = Math.min(length1, length2);
      let i = 0;
      for (i; i < minlength; i++) {
          let a = parseInt(arr1[i]);
          let b = parseInt(arr2[i]);
          if (a > b) {
              return 1;
          }
          else if (a < b) {
              return -1;
          }
      }
      if (length1 > length2) {
          for (let j = i; j < length1; j++) {
              if (parseInt(arr1[j]) != 0) {
                  return 1;
              }
          }
          return 0;
      }
      else if (length1 < length2) {
          for (let j = i; j < length2; j++) {
              if (parseInt(arr2[j]) != 0) {
                  return -1;
              }
          }
          return 0;
      }
      return 0;
  };
  const getPagePerformance = () => {
      let times = {};
      let t = window.performance.timing;
      // 优先使用 navigation v2  https://www.w3.org/TR/navigation-timing-2/
      if (typeof window.PerformanceNavigationTiming === "function") {
          t = window.performance.getEntriesByType("navigation")[0] || t;
      }
      //重定向时间
      times.redirectTime = t.redirectEnd - t.redirectStart;
      //dns查询耗时
      times.dnsTime = t.domainLookupEnd - t.domainLookupStart;
      //TTFB 读取页面第一个字节的时间
      times.ttfbTime = t.responseStart - t.navigationStart;
      //DNS 缓存时间
      times.appcacheTime = t.domainLookupStart - t.fetchStart;
      //卸载页面的时间
      times.unloadTime = t.unloadEventEnd - t.unloadEventStart;
      //tcp连接耗时
      times.tcpTime = t.connectEnd - t.connectStart;
      //request请求耗时
      times.reqTime = t.responseEnd - t.responseStart;
      //解析dom树耗时
      times.analysisTime = t.domComplete - t.domInteractive;
      //白屏时间
      times.blankTime = (t.domInteractive || t.domLoading) - t.fetchStart;
      //domReadyTime
      times.domReadyTime = t.domContentLoadedEventEnd - t.fetchStart;
      return times;
  };
  const sleep = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
  };

  /******************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  var version = "0.1.0";

  function isValidKey(key, object) {
      return key in object;
  }
  const initParamsConsole = (params) => __awaiter(void 0, void 0, void 0, function* () {
      yield sleep(100);
      const PagePerformance = getPagePerformance();
      setCache(LocalStoreEnum.PAGE_PERFORMANCE, PagePerformance);
      const { blankTime, analysisTime } = PagePerformance;
      const { config = {}, debug = false, url = "", method = "GET", enableHeatMap = false, enableVisibilitychange = false } = params;
      let paramsInfo = [
          {
              key: "url",
              desc: "接口地址",
              value: url,
          },
          {
              key: "method",
              desc: "请求方式",
              value: method,
          },
          {
              key: "enableHeatMap",
              desc: "开启坐标上传 position",
              value: enableHeatMap,
          },
          {
              key: "enableVisibilitychange",
              desc: "页面可见监听",
              value: enableVisibilitychange,
          },
          {
              key: "config",
              desc: "自定义传参",
              value: config,
          },
          {
              key: "blankTime",
              desc: "页面白屏时间(毫秒)",
              value: blankTime.toFixed(2),
          },
          {
              key: "version",
              desc: "当前SDK版本",
              value: version,
          },
      ];
      cConsole({
          text: 'simple-js-tracker SDK 初始化成功!',
          type: "log",
          debug: debug,
      });
      cConsole({
          text: paramsInfo,
          type: "table",
          debug: debug,
      });
  });
  const cConsole = function (params) {
      const { text, type = "log", debug = false } = params;
      if (isValidKey(type, console)) {
          const func = console[type];
          debug && func(text);
      }
  };

  const xmlRequest = (url, params) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, false);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      xhr.send(JSON.stringify(params));
  };
  const sendBeacon = (url, params) => {
      const data = new URLSearchParams(params);
      const headers = {
          type: "application/x-www-form-urlencoded",
      };
      const blob = new Blob([data], headers);
      navigator.sendBeacon(url, blob);
  };
  const report = function (url, method, data) {
      const params = filterParams(data);
      const str = Object.entries(data)
          .map(([key, value]) => `${key}=${typeof value === "string" ? encodeURI(value) : value}`)
          .join("&");
      if (navigator.sendBeacon !== undefined && method === "SEND_BEACON") {
          sendBeacon(url, params);
      }
      else if (method === "POST" || urlIsLong(str)) {
          xmlRequest(url, params);
      }
      else {
          const img = new Image();
          img.src = `${url}?${str}`;
      }
  };
  const sendTracker = (options, data) => {
      const defaultData = Object.assign(Object.assign({}, options), data);
      cConsole({
          text: defaultData,
          debug: options.debug,
      });
      report(options.url, options.method, defaultData);
  };
  const autoSendTracker = (options) => {
      const params = getCache(LocalStoreEnum.OPSIONS);
      if (!params)
          return;
      const { url, enableHeatMap } = params;
      let position = "";
      if (enableHeatMap &&
          typeof options.x === "number" &&
          typeof options.y === "number") {
          position = getheatMap(options.x, options.y);
          delete options.x;
          delete options.y;
      }
      const defaultData = Object.assign(Object.assign(Object.assign({}, params), options), { position });
      cConsole({
          text: defaultData,
          debug: params.debug,
      });
      report(url, params.method, defaultData);
  };

  const initHashEvent = (fs, options) => {
      window.addEventListener("hashchange", (e) => { });
  };
  const initErrorEvent = (options) => __awaiter(void 0, void 0, void 0, function* () {
      const { errorCallback, vm } = options;
      yield sleep(500);
      // vue
      if (vm != null && vm.config) {
          vm.config.errorHandler = (error) => {
              const pageInfo = getCache(LocalStoreEnum.PAGE_INFO);
              errorCallback({
                  errorMsg: error,
                  pageInfo: pageInfo,
              });
          };
      }
      /*
       * @param msg{String}：  错误消息
       * @param url{String}：  发生错误页面的url
       * @param line{Number}： 发生错误的代码行
       */
      window.onerror = (error, url, line) => {
          const pageInfo = getCache(LocalStoreEnum.PAGE_INFO);
          errorCallback({
              errorMsg: error,
              line: line,
              pageInfo: pageInfo,
          });
          return true;
      };
  });
  const setVueRouterEvent = (router, options, cb) => {
      const params = getCache(LocalStoreEnum.OPSIONS);
      if (!params)
          return;
      let currentPageInfo = null;
      const reportCallback = (reportData) => {
          autoSendTracker(reportData);
      };
      const getStopSecound = (to) => {
          const timestamp = new Date().getTime();
          const pretimestamp = getCache(LocalStoreEnum.PRE_TIMESTAMP) || timestamp;
          setCache(LocalStoreEnum.PRE_TIMESTAMP, timestamp);
          setCache(LocalStoreEnum.PAGE_INFO, JSON.stringify(to.meta));
          let secound = 0;
          if (timestamp != pretimestamp) {
              secound = (timestamp - pretimestamp) / 1000;
              cConsole({
                  text: `当前停留页面${secound.toFixed(2)}s`,
                  debug: options.debug,
              });
          }
          return secound;
      };
      if (options === null || options === void 0 ? void 0 : options.enableVisibilitychange) {
          document.addEventListener("visibilitychange", function () {
              const state = document.visibilityState;
              let callbackData = null;
              if (state === "hidden") {
                  const secound = getStopSecound(currentPageInfo);
                  callbackData = {
                      from: currentPageInfo,
                      to: null,
                      secound,
                  };
              }
              if (state === "visible") {
                  callbackData = {
                      to: currentPageInfo,
                      from: null,
                      secound: 0,
                  };
              }
              cb(callbackData, reportCallback);
          });
      }
      router.beforeEach((to, from, next) => {
          currentPageInfo = to;
          const secound = getStopSecound(to);
          cb({
              to,
              from,
              secound,
          }, reportCallback);
          next();
      });
  };

  function _setConfig(fs, options) {
      const { config } = options;
      initParamsConsole(options);
      if (typeof config === "object" && config != null) {
          options = Object.assign(config, defaultOptions, options);
      }
      delete options["config"];
      fs._options = options;
      setCache(LocalStoreEnum.OPSIONS, options);
  }
  function _initEvent(fs, options) {
      // 开始hash router 监听
      if (options.enableHashTracker) {
          initHashEvent();
      }
  }
  function initMixin(simpleJsTracker) {
      simpleJsTracker.prototype._init = function (options) {
          const fs = this;
          if (options) {
              _setConfig(fs, options);
              _initEvent(fs, options);
          }
      };
  }

  // function SimpleJsTracker(this: ISimpleJsTracker, options: IDefaultOptions): ISimpleJsTracker  {
  //   // 初始化sdk
  //   this._init(options);
  //   return this;
  // }
  class SimpleJsTracker {
      constructor(options) {
          this['_init'](options);
      }
  }
  initMixin(SimpleJsTracker);

  class Click {
      add(entry) {
          entry.el.addEventListener("click", function (e) {
              autoSendTracker(Object.assign(Object.assign({}, entry.binding.value), { x: e.clientX, y: e.clientY }));
          });
      }
      remove(entry) {
          entry.el.removeEventListener("click", () => { });
      }
  }

  class Keyup {
      add(entry) {
          entry.el.addEventListener("keyup", function (e) {
              if (e.keyCode === 13) {
                  autoSendTracker(entry.binding.value);
              }
          });
      }
      remove(entry) {
          entry.el.removeEventListener("keyup", () => { });
      }
  }

  // 实例化曝光和点击
  const cli$1 = new Click();
  const keyup$1 = new Keyup();
  const track_v2 = {
      inserted: function (el, binding) {
          const { arg } = binding;
          arg.split("|").forEach((item) => {
              // 点击
              switch (item) {
                  case "click":
                      cli$1.add({ el, binding });
                      break;
                  case "keyup":
                      keyup$1.add({ el, binding });
                      break;
              }
          });
      },
      unbind(el, binding) {
          const { arg } = binding;
          arg.split("|").forEach((item) => {
              // 点击
              switch (item) {
                  case "click":
                      cli$1.remove({ el, binding });
                      break;
                  case "keyup":
                      keyup$1.remove({ el, binding });
                      break;
              }
          });
      },
  };
  function setTrackV2Directives(app) {
      app.directive("track", track_v2);
  }

  // 实例化曝光和点击
  const cli = new Click();
  const keyup = new Keyup();
  const track_v3 = {
      mounted(el, binding) {
          const { arg } = binding;
          arg.split("|").forEach((item) => {
              // 点击
              switch (item) {
                  case "click":
                      cli.add({ el, binding });
                      break;
                  case "keyup":
                      keyup.add({ el, binding });
                      break;
              }
          });
      },
      beforeUnmount(el, binding) {
          const { arg } = binding;
          arg.split("|").forEach((item) => {
              // 点击
              switch (item) {
                  case "click":
                      cli.remove({ el, binding });
                      break;
                  case "keyup":
                      keyup.remove({ el, binding });
                      break;
              }
          });
      },
  };
  function setTrackV3Directives(app) {
      app.directive("track", track_v3);
  }

  function initGlobalFun(FSTracker) {
      FSTracker.prototype.setConfig = function (options) {
          options = Object.assign({}, this._options, options);
          setCache(LocalStoreEnum.OPSIONS, options);
      };
      FSTracker.prototype.sendTracker = function (data = {}) {
          sendTracker(this._options, data);
      };
      FSTracker.prototype.initDirectives = function (app) {
          if (app.version && compareVersion("3.0.0", app.version) > 0) {
              setTrackV2Directives(app);
          }
          else {
              setTrackV3Directives(app);
          }
      };
      FSTracker.prototype.registerVueRouterEvent = function (router, cb) {
          setVueRouterEvent(router, this._options, cb);
      };
      FSTracker.prototype.registerErrorEvent = function (cb) {
          initErrorEvent(cb);
      };
  }

  initGlobalFun(SimpleJsTracker);

  return SimpleJsTracker;

}));
