import { ICustomOptions } from "../types/index";
import {
  filterParams,
  urlIsLong,
  cConsole,
  getheatMap,
  getCache,
} from "../utils/index";

const xmlRequest = (url: string, params: ICustomOptions) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.send(JSON.stringify(params));
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
  const params = filterParams(data);
  const str = Object.entries(data)
    .map(
      ([key, value]) =>
        `${key}=${typeof value === "string" ? encodeURI(value) : value}`
    )
    .join("&");
  if (navigator.sendBeacon !== undefined && method === "SEND_BEACON") {
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

export const autoSendTracker = (options: ICustomOptions) => {
  const params = getCache("options");
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