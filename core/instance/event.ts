import {
  cConsole,
  setCache,
  getCache,
  getPagePerformance,
  sleep,
} from "../utils/index.js";
import { autoSendTracker } from "../global/http.js";
import { LocalStoreEnum } from "../enum/localstore.js";

export const initHashEvent = (fs, options) => {
  window.addEventListener("hashchange", (e) => {});
};

export const initErrorEvent = async (options) => {
  const { errorCallback, vm } = options;

  await sleep(500);
  // vue
  if (vm != null && vm.config) {
    vm.config.errorHandler = (error) => {
      const pageInfo = getCache(LocalStoreEnum.PAGE_INFO)
      errorCallback({
        errorMsg: error,
        pageInfo: pageInfo
      });
    };
  }
  /*
   * @param msg{String}：  错误消息
   * @param url{String}：  发生错误页面的url
   * @param line{Number}： 发生错误的代码行
   */
  window.onerror = (error, url, line) => {
    const pageInfo = getCache(LocalStoreEnum.PAGE_INFO)
    errorCallback({
      errorMsg: error,
      line: line,
      pageInfo: pageInfo
    });
    return true;
  };
};

export const setVueRouterEvent = (router, options, cb) => {
  const params = getCache(LocalStoreEnum.OPSIONS);

  if (!params) return;

  router.beforeEach((to, from, next) => {
    const timestamp = new Date().getTime();
    const pretimestamp = getCache(LocalStoreEnum.PRE_TIMESTAMP) || timestamp;
    setCache(LocalStoreEnum.PRE_TIMESTAMP, timestamp);
    setCache(LocalStoreEnum.PAGE_INFO, JSON.stringify(to.meta));
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
