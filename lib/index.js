(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.FSTracker = factory());
})(this, (function () { 'use strict';

  const defaultOptions = {
    debug: false,
    url: "",
    // 埋点请求后端接口

    config: null,
    enableDecorator: false,
    // 开启装饰器

    enableHeatMap: false,
    enableHashTracker: false
  };

  const cConsole = function (params) {
    const {
      text,
      type = "log",
      debug = false
    } = params;
    debug && console[type](text);
  };

  const initHashEvent = (fs, options) => {
    // 一块家
    window.addEventListener('hashchange', e => {
      console.log(e);
    });
  };
  const setVueRouterEvent = (router, options, cb) => {
    router.beforeEach((to, from, next) => {
      const timestamp = new Date().getTime();
      const pretimestamp = localStorage.getItem('pretimestamp') || timestamp;
      localStorage.setItem('pretimestamp', timestamp);
      let secound = '';
      if (timestamp != pretimestamp) {
        secound = (timestamp - pretimestamp) / 1000;
        // cConsole({
        //   text: `当前停留页面${secound.toFixed(2)}s`,
        //   debug: options.debug
        // })
      }

      cb({
        to,
        from,
        secound
      }, res => {
        console.log(res);
      });
      next();
    });
  };

  function _setConfig(fs, options) {
    const {
      config
    } = options;
    delete options.config;
    options = Object.assign(config, defaultOptions, options);
    fs._options = options;
    localStorage.setItem('fspace-tracker', JSON.stringify(options));
  }
  function _initEvent(fs, options) {
    // 开始hash router 监听
    if (options.enableHashTracker) {
      initHashEvent();
    }
  }
  function initMixin(FSTracker) {
    FSTracker.prototype._init = function (options) {
      const fs = this;
      if (options) {
        _setConfig(fs, options);
        _initEvent(fs, options);
      }
    };
  }

  class Click {
    add(entry) {
      entry.el.addEventListener("click", function (e) {
        dvRequest({
          ...entry.binding.value,
          x: e.clientX,
          y: e.clientY
        });
      });
    }
    remove(entry) {
      entry.el.removeEventListener("click", () => {});
    }
  }

  class Keyup {
    add(entry) {
      entry.el.addEventListener("keyup", function (e) {
        if (e.keyCode === 13) {
          dvRequest(entry.binding.value);
        }
      });
    }
    remove(entry) {
      entry.el.removeEventListener("keyup", () => {});
    }
  }

  class Exposure {
    add(entry) {
      entry.el.attributes["track-pid"].value;
      entry.el.attributes["track-params"].value;
      console.log(entry.value);
    }
  }

  // 实例化曝光和点击
  const exp = new Exposure();
  const cli = new Click();
  const keyup = new Keyup();
  const track = {
    inserted: function (el, binding) {
      const {
        arg
      } = binding;
      arg.split("|").forEach(item => {
        // 点击
        switch (item) {
          case "click":
            cli.add({
              el,
              binding
            });
            break;
          case "keyup":
            keyup.add({
              el,
              binding
            });
            break;
          case "exposure":
            exp.add({
              el
            });
            break;
        }
      });
    },
    unbind(el, binding) {
      const {
        arg
      } = binding;
      arg.split("|").forEach(item => {
        // 点击
        switch (item) {
          case "click":
            cli.remove({
              el,
              binding
            });
            break;
          case "keyup":
            keyup.remove({
              el,
              binding
            });
            break;
          case "exposure":
            exp.remove({
              el,
              binding
            });
            break;
        }
      });
    }
  };
  function setTrackDirectives(app) {
    app.directive("track", track);
  }

  const setVueGlobDirectives = app => {
    setTrackDirectives(app);
  };

  const filterParams = function (data) {
    Object.keys(data).forEach(key => {
      if (defaultOptions[key] !== undefined) {
        delete data[key];
      }
    });
    return data;
  };
  const xmlHttpRequest = function (url, data) {
    const params = filterParams(data);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send(JSON.stringify(params));
  };
  const trackingToPageParams = id => {
    id = id.toString();
    if (!id && id.length < 2) return {};
    const page_type = id.slice(0, 1);
    const page_id = id.slice(1);
    return {
      page_type,
      page_id
    };
  };
  const getheatMap = (x, y) => {
    return `${x}.${y}`;
  };
  const dvRequest = function (options) {
    const params = JSON.parse(localStorage.getItem("fspace-tracker")) || null;
    if (!params) return;
    const {
      url,
      enableHeatMap
    } = params;
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
      ...trackingToPageParams(options.tracking)
    };
    xmlHttpRequest(url, defaultData);
  };
  function initGlobalFun(FSTracker) {
    FSTracker.prototype.setConfig = function (options) {
      options = Object.assign({}, this._options, options);
      localStorage.setItem("fspace-tracker", JSON.stringify(options));
    };
    FSTracker.prototype.sendTracker = function (data = {}) {
      const defaultData = {
        ...this._options,
        ...data
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

  /**
   * 初始化埋点sdk
   * @param {*} options
   */
  function FSTracker(options) {
    this._init(options);
  }
  initMixin(FSTracker);
  initGlobalFun(FSTracker);

  return FSTracker;

}));
