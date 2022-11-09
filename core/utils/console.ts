import { IConcosle } from "../types/index";
import { version } from "../../package.json";
import { getPagePerformance, sleep } from "./basic";
import { setCache } from "./cache";
import { sessionStoreEnum } from "../enum";

export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object;
}

export const initParamsConsole = async (params) => {
  await sleep(100);
  const PagePerformance = getPagePerformance();
  setCache(sessionStoreEnum.PAGE_PERFORMANCE, PagePerformance);
  const { blankTime, analysisTime } = PagePerformance;
  const {
    config = {},
    debug = false,
    url = "",
    method = "GET",
    enableHeatMap = false,
    enableVisibilitychange = false
  } = params;

  let paramsInfo = [
    {
      key: "url",
      desc: "接口地址",
      value: url,
    },
    {
      key: "method",
      desc: "请求方式",
      value: method,
    },
    {
      key: "enableHeatMap",
      desc: "开启坐标上传 position",
      value: enableHeatMap,
    },
    {
      key: "enableVisibilitychange",
      desc: "页面可见监听",
      value: enableVisibilitychange,
    },
    {
      key: "config",
      desc: "自定义传参",
      value: config,
    },
    {
      key: "blankTime",
      desc: "页面白屏时间(毫秒)",
      value: blankTime.toFixed(2),
    },
    {
      key: "version",
      desc: "当前SDK版本",
      value: version,
    },
  ];
  cConsole({
    text: 'simple-js-tracker SDK 初始化成功!',
    type: "log",
    debug: debug,
  });
  cConsole({
    text: paramsInfo,
    type: "table",
    debug: debug,
  });
};

export const cConsole = function (params: IConcosle) {
  const { text, type = "log", debug = false } = params;
  if (isValidKey(type, console)) {
    const func: any = console[type];
    debug && func(text);
  }
};
