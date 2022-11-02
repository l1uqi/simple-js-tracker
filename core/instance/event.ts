import { cConsole, setCache, getCache, getPagePerformance } from "../utils/index.js";
import { autoSendTracker } from "../global/http.js";
import { LocalStoreEnum } from "../enum/localstore.js";

export const initHashEvent = (fs, options) => {
  // 一块家
  window.addEventListener("hashchange", (e) => {
    console.log(e);
  });
};

export const setVueRouterEvent = (router, options, cb) => {
  const params = getCache(LocalStoreEnum.OPSIONS);

  if (!params) return;

  router.beforeEach((to, from, next) => {
    const timestamp = new Date().getTime();
    const pretimestamp = getCache(LocalStoreEnum.PRE_TIMESTAMP) || timestamp;
    setCache(LocalStoreEnum.PRE_TIMESTAMP, timestamp);
    let secound = 0;
    if (timestamp != pretimestamp) {
      secound = (timestamp - pretimestamp) / 1000;
      cConsole({
        text: `当前停留页面${secound.toFixed(2)}s`,
        debug: options.debug,
      });
    }
    cb(
      {
        to,
        from,
        secound,
      },
      (reportData) => {
        autoSendTracker(reportData);
      }
    );
    
    next();
  });
};
