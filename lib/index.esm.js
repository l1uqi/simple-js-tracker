const defaultOptions = {
    debug: false,
    url: '',
    method: 'GET',
    config: null,
    enableDecorator: false,
    enableHeatMap: false,
    enableHashTracker: false
};

const basicKey = "sjt_";
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

const cConsole = function (params) {
    const { text, type = "log", debug = false } = params;
    if (isValidKey(type, console)) {
        const func = console[type];
        debug && func(text);
    }
};
const filterParams = function (data) {
    Object.keys(data).forEach((key) => {
        if (defaultOptions[key] !== undefined) {
            delete data[key];
        }
    });
    return data;
};
function isValidKey(key, object) {
    return key in object;
}
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
        text: data,
        debug: options.debug,
    });
    report(options.url, options.method, defaultData);
};
const autoSendTracker = (options) => {
    const params = getCache("options");
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
    // 一块家
    window.addEventListener("hashchange", (e) => {
        console.log(e);
    });
};
const setVueRouterEvent = (router, options, cb) => {
    const params = getCache('options');
    if (!params)
        return;
    router.beforeEach((to, from, next) => {
        const timestamp = new Date().getTime();
        const pretimestamp = getCache("pretimestamp") || timestamp;
        setCache("pretimestamp", timestamp);
        let secound = 0;
        if (timestamp != pretimestamp) {
            secound = (timestamp - pretimestamp) / 1000;
            cConsole({
                text: `当前停留页面${secound.toFixed(2)}s`,
                debug: options.debug,
            });
        }
        cb({
            to,
            from,
            secound,
        }, (reportData) => {
            autoSendTracker(reportData);
        });
        next();
    });
};

function _setConfig(fs, options) {
    const { config } = options;
    delete options['config'];
    if (typeof config === 'object' && config != null) {
        options = Object.assign(config, defaultOptions, options);
    }
    fs._options = options;
    setCache('options', options);
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
        setCache("options", options);
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
}

initGlobalFun(SimpleJsTracker);

export { SimpleJsTracker as default };
