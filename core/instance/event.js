import { cConsole } from "../utils/index.js";
import { report } from '../report.js'

export const initHashEvent = (fs, options) => {
  // 一块家
  window.addEventListener('hashchange', (e) => {
    console.log(e);
  })
}

export const setVueRouterEvent = (router, options, cb) => {
  const params = JSON.parse(localStorage.getItem("fspace-tracker")) || null;
  if (!params) return;

  router.beforeEach((to, from, next) => {
    const timestamp = new Date().getTime();
    const pretimestamp = localStorage.getItem('pretimestamp') || timestamp
    localStorage.setItem('pretimestamp', timestamp)
    let secound = '';
    if(timestamp != pretimestamp) {
      secound = (timestamp - pretimestamp) / 1000
      cConsole({
        text: `当前停留页面${secound.toFixed(2)}s`,
        debug: options.debug
      })
    }
    cb({
      to,
      from,
      secound
    },(data) => {
      const { url, method } = params;
      const reportData = {
        ...params,
        ...data,
      };
      // report(url, method, reportData);
    })
    next();
  });
}