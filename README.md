## 数据埋点 SDK

简单易用前端埋点、用户行为数据采集 SDK

## 特性

- 🚀 支持上报参数支持自定义， 上传方式多样
- 🚀 支持 Vue2/Vue3
- 💪 提供 Vue 指令方式调用
- 💪 支持 TypeScript
- 💪 全局异常捕获

## 安装

```
npm install simple-js-tracker

yarn add simple-js-tracker

// cdn 引用
<script src="https://cdn.jsdelivr.net/npm/simple-js-tracker@0.0.7/lib/index.min.js"></script>
```

## 初始化

```js
import SimpleJsTracker from "simple-js-tracker";

const simpleJsTracker = new SimpleJsTracker({
  debug: true,
  url: "", // 服务地址
  enableHeatMap: true, // 开启热力图
  enableHashTracker: true,
  config: {
    ...
  }
});
```

## 参数

| 参数                   | 必填 | 默认值 | 类型   |                                                            |
| ---------------------- | ---- | ------ | ------ | ---------------------------------------------------------- |
| debug                  | 否   | false  | bool   | 开启调试模式                                               |
| config                 | 否   | object | {}     | 你的配置文件, 会在上报时传给后端                           |
| url                    | 是   | ''     | string | 请求地址                                                   |
| method                 | 否   | img    | string | 请求方式 GET、POST、SEND_BEACON                            |
| enableHeatMap          | 否   | false  | bool   | 开启坐标上传 position                                      |
| enableVisibilitychange | 否   | false  | bool   | 开启页面可见监听, 如开启此功能 registerVueRouterEvent 传参可能为 null |

## 方法

| 方法名                 | 说明                  | 参数                                                             |
| ---------------------- | --------------------- | ---------------------------------------------------------------- |
| setConfig              | 设置全局参数          | Options                                                          |
| sendTracker            | 手动上报              | {自定义}                                                         |
| initDirectives         | 初始化 vue2 指令      | Vue                                                              |
| registerVueRouterEvent | 初始化 VueRouter 监听 | VueRouter, callback({to, from , secound,...}, callback)          |
| registerErrorEvent     | 全局异常报错          | vm: Vue 对象, errorCallback((errorMsg, pageInfo) => {}) 异常回调 |

## 指令

指令需要初始化, 且指令会自动上报

### Vue2.0

| 方法名        | 说明     | 参数 |
| ------------- | -------- | ---- |
| v-track:click | 点击事件 | {}   |
| v-track:keyup | 键盘事件 | {}   |

```html
// 点击
<div v-track:click="{'event_type': 12, ...}">加入购物车</div>

// 键盘
<div v-track:keyup="{'event_type': 10, ...}">搜索</div>
```

## 打包

```
npm build

npm publish
```

## 异常

```js
const simpleJsTracker = new SimpleJsTracker({
  debug: true,
  url: "", // 服务地址
  enableHeatMap: true, // 开启热力图
  enableHashTracker: true,
  config: {
    ...
  }
});

simpleJsTracker.registerErrorEvent({
  vm: Vue,// vue实例 vue环境下可传
  errorCallback: (error) => {
    // error : {
    //   errorMsg, 异常信息
    //   pageInfo 当前页面信息
    // }
    console.log(error)
  }
})
```

## 例子

```js
import SimpleJsTracker from "simple-js-tracker";

const simpleJsTracker = new SimpleJsTracker({
  debug: true,
  url: "", // 服务地址
  enableHeatMap: true, // 开启热力图
  enableHashTracker: true,
  config: {
    ...
  }
});

// 更新传参
simpleJsTracker.setConfig(options);

// 自定义上传
simpleJsTracker.sendTracker(params);

// 初始化自定义vue2/3指令
simpleJsTracker.initDirectives(Vue);

// 初始化 VueRouter 监听
// 页面跳转监听， 上报的参数让用户自行提供 report
simpleJsTracker.registerVueRouterEvent(router, (res, report) => {
   const { to, from, secound } = res;
   // 页面进入
  if(to.meta.tracking) {
    const fromParams = {
      'event_type': 5,
      ...to.meta.tracking,
    }

    request(fromParams);
  }
  // 页面离开
  if(from.meta.tracking) {
    const fromParams = {
      'event_type': 6,
      ...from.meta.tracking,
    }
    request(fromParams);
  }
});

```

## 待办

- [x] 多种上报方式
- [x] Vue3
- [ ] 装饰器
- [ ] hash 页面监听实现
- [ ] 全局上报
- [ ] 异常捕获

## 开源协议

本项目基于 [MIT](https://zh.wikipedia.org/wiki/MIT%E8%A8%B1%E5%8F%AF%E8%AD%89)协议，请自由地享受和参与开源。
