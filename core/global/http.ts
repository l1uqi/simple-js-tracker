import { sessionStoreEnum } from "../enum";
import { ICustomOptions } from "../types/index";
import {
  filterParams,
  urlIsLong,
  cConsole,
  getheatMap,
  getCache,
} from "../utils/index";

const xmlRequest = (url: string, params: ICustomOptions, timeout: number) => {
  try {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    var timedout = false;
    var timer = setTimeout(function () {
      timedout = true;
      xhr.abort();
  }, timeout);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4)
          return;
      if (timedout)
          return;
      clearTimeout(timer);
  };
    xhr.send(JSON.stringify(params));
  } catch (error) {
      console.log(error);
  }
};

const sendBeacon = (url: string, params: any) => {
  const data: any = new URLSearchParams(params);
  const headers = {
    type: "application/x-www-form-urlencoded",
  };
  const blob = new Blob([data], headers);
  navigator.sendBeacon(url, blob);
};

const report = function (url: string, method: string, data: ICustomOptions) {
  const timeout = Number(data.timeout);

  const params = filterParams(data);
  
  const str = Object.entries(data)
    .map(
      ([key, value]) => `${key}=${typeof value === "string" ? encodeURI(value) : value}`
    )
    .join("&");
    debugger
  if (navigator.sendBeacon !== undefined && method === "SEND_BEACON") {
    sendBeacon(url, params);
  } else if (method === "POST" || urlIsLong(str)) {
    xmlRequest(url, params, timeout);
  } else {
    const img = new Image();
    img.src = `${url}?${str}`;
    setTimeout(() => {
      img.src = ''
    }, timeout);
  }
};

export const sendTracker = (options, data) => {
  const params = getCache(sessionStoreEnum.OPSIONS);
  cConsole({
    text: data,
    debug: options.debug,
  });
  const defaultData = {
    ...params,
    ...data,
  };
  report(options.url, options.method, defaultData);
};

export const autoSendTracker = (options: ICustomOptions) => {
  const params = getCache(sessionStoreEnum.OPSIONS);
  if (!params) return;
  const { url, enableHeatMap } = params;
  let position = "";
  if (
    enableHeatMap &&
    typeof options.x === "number" &&
    typeof options.y === "number"
  ) {
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
    debug: params.debug,
  });
  report(url, params.method, defaultData);
};


export const autoSendErrorTracker = (options: ICustomOptions) => {
  const params = getCache(sessionStoreEnum.OPSIONS);
  if (!params) return;
  const { url, enableHeatMap } = params;
  const defaultData = {
    ...params,
    ...options
  };
  cConsole({
    text: defaultData,
    debug: params.debug,
  });
  report(url, params.method, defaultData);
};