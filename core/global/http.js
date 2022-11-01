import {
  filterParams,
  urlIsLong,
  cConsole,
  getheatMap,
} from "../utils/index.js";

const xmlRequest = (url, params) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.send(JSON.stringify(params));
};

// 后端目前不支持
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
    .map(([key, value]) => `${key}=${encodeURI(value)}`)
    .join("&");
  if (navigator.sendBeacon && method === "SEND_BEACON") {
    sendBeacon(url, params);
  } else if (method === "POST" || urlIsLong(str)) {
    xmlRequest(url, params);
  } else {
    const img = new Image();
    img.src = `${url}?${str}`;
  }
};

export const sendTracker = (options, data) => {
  const defaultData = {
    ...options,
    ...data,
  };

  cConsole({
    text: data,
    debug: options.debug,
  });
  report(options.url, options.method, defaultData);
};

export const autoSendTracker = (options) => {
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
    debug: params.debug,
  });
  report(url, params.method, defaultData);
};
