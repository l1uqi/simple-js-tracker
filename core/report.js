import { filterParams, urlIsLong, cConsole } from "./utils.js";

function xmlHttpRequest(url, params) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.send(JSON.stringify(params));
}

// 后端目前不支持
function sendBeacon(url, params) {
  const data = new URLSearchParams(params);
  const headers = {
    type: "application/x-www-form-urlencoded",
  };
  const blob = new Blob([data], headers);
  navigator.sendBeacon(url, blob);
}

export const report = function (url, method, data) {
  const params = filterParams(data);
  const str = Object.entries(data)
    .map(([key, value]) => `${key}=${encodeURI(value)}`)
    .join("&");
  if (navigator.sendBeacon && method === "sendBeacon") {
    sendBeacon(url, params);
  } else if (method === "POST" || urlIsLong(str)) {
    xmlHttpRequest(url, params);
  } else {
    const img = new Image();
    img.src = `${url}?${str}`;
  }
};
