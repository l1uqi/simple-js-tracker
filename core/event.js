import { cConsole } from "./utils.js";

export const initHashEvent = (fs, options) => {
  // 一块家
  window.addEventListener('hashchange', (e) => {
    console.log(e);
  })
}

export const setVueRouterEvent = (router, options, cb) => {
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
    },(request) => {
      console.log(request)
    })
    next();
  });
}