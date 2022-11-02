import { IDefaultOptions, ICustomOptions } from "../types/index";
import { defaultOptions } from '../config'

export const filterParams = function (data: ICustomOptions) {
  Object.keys(data).forEach((key: string) => {
    if (defaultOptions[key] !== undefined) {
      delete data[key];
    }
  });
  return data;
};

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

export const getPagePerformance = () => {
  let times: any = {};
  let t: any = window.performance.timing;

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
   times.blankTime =  (t.domInteractive || t.domLoading)  - t.fetchStart;
   
   //domReadyTime
   times.domReadyTime = t.domContentLoadedEventEnd - t.fetchStart;
  return times;
};


export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}