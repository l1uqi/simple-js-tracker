import { IDefaultOptions, IConcosle, ICustomOptions } from "../types/index";
import { defaultOptions } from '../config'

export const cConsole = function (params: IConcosle) {
  const { text, type = "log", debug = false } = params;
  if(isValidKey(type, console)) {
    const func: any = console[type];
    debug && func(text);
  }
};

export const filterParams = function (data: ICustomOptions) {
  Object.keys(data).forEach((key: string) => {
    if (defaultOptions[key] !== undefined) {
      delete data[key];
    }
  });
  return data;
};

export function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object;
}

export const getheatMap = (x: number, y: number) => {
  return `${x}.${y}`;
};

export const urlIsLong = (url: string) => {
  let totalLength = 0,
    charCode = 0;
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


export const compareVersion = (version1: string, version2: string) => {
  const arr1 = version1.split('.')
  const arr2 = version2.split('.')
  const length1 = arr1.length
  const length2 = arr2.length
  const minlength = Math.min(length1, length2)
  let i = 0
  for (i ; i < minlength; i++) {
    let a = parseInt(arr1[i])
    let b = parseInt(arr2[i])
    if (a > b) {
      return 1
    } else if (a < b) {
      return -1
    }
  }
  if (length1 > length2) {
    for(let j = i; j < length1; j++) {
      if (parseInt(arr1[j]) != 0) {
        return 1
      }
    }
    return 0
  } else if (length1 < length2) {
    for(let j = i; j < length2; j++) {
      if (parseInt(arr2[j]) != 0) {
        return -1
      }
    }
    return 0
  }
  return 0
}