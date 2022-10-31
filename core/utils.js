import { defaultOptions } from "./type.js";

export const cConsole = function (params) {
  const { text, type = "log", debug = false } = params;
  debug && console[type](text);
};

export const filterParams = function (data) {
  Object.keys(data).forEach((key) => {
    if (defaultOptions[key] !== undefined) {
      delete data[key];
    }
  });
  return data;
};

export const getheatMap = (x, y) => {
  return `${x}.${y}`;
};

export const urlIsLong = (url) => {
  let totalLength = 0,
    charCode = null;
  for (var i = 0; i < url.length; i++) {
    charCode = url.charCodeAt(i);
    if (charCode < 0x007f) {
      totalLength++;
    } else if (0x0080 <= charCode && charCode <= 0x07ff) {
      totalLength += 2;
    } else if (0x0800 <= charCode && charCode <= 0xffff) {
      totalLength += 3;
    }
  }
  return totalLength < 2000 ? false : true;
};
