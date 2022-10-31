# 数据埋点 SDK

简单易用前端埋点、用户行为数据采集 SDK

## 安装

---

```
npm install simple-js-tracker

yarn add simple-js-tracker

// cdn
<script src="https://cdn.jsdelivr.net/npm/simple-js-tracker@0.0.2/lib/index.min.js"></script>
```

## 初始化

---

```js
import SimpleJsTracker from "simple-js-tracker";

const fst = new SimpleJsTracker({
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

---

| 参数          | 必填 | 默认值 | 类型   |                                  |
| ------------- | ---- | ------ | ------ | -------------------------------- |
| debug         | 否   | false  | bool   | 开启调试模式                     |
| config        | 否   | object | {}     | 你的配置文件, 会在上报时传给后端 |
| url           | 是   | ''     | string | 请求地址                         |
| enableHeatMap | 否   | false  | bool   | 开启坐标上传 position            |

## 方法

---

| 方法名                 | 说明                  | 参数       |
| ---------------------- | --------------------- | ---------- |
| setConfig              | 设置全局参数          | Options    |
| sendTracker            | 手动上报              | {自定义}   |
| initDirectives         | 初始化 vue2 指令      | Vue        |
| registerVueRouterEvent | 初始化 VueRouter 监听 | VueRouter, callback({to, from , secound,...}, callback)  |

## 指令

---

指令需要初始化, 且指令会自动上报

### Vue2.0

---

| 方法名        | 说明     | 参数 |
| ------------- | -------- | ---- |
| v-track:click | 点击事件 | ...  |
| v-track:keyup | 键盘事件 | ...  |

```html
// 点击
<div v-track:click="{'event_type': 12, ...}">加入购物车</div>

// 键盘
<div v-track:keyup="{'event_type': 10, ...}">搜索</div>
```

## 例子

---

```js
import FSTracker from "fspacefe-tracker";

const fst = new FSTracker({
  debug: true,
  url: "", // 服务地址
  enableHeatMap: true, // 开启热力图
  enableHashTracker: true,
  config: {
    ...
  }
});

// 更新传参
fst.setConfig(options);

// 自定义上传
fst.sendTracker(params);

// 初始化自定义vue2指令
fst.initDirectives(Vue);

// 初始化 VueRouter 监听
fst.registerVueRouterEvent(router, (res, request) => {
  const { to, from, secound } = res;
  // to, from , secound
  // 上传对象
  const requestParams = {
    a: '魔兽老了',
    b: '记忆中的口袋里'
  };
  request(requestParams);
});
```

## 打包

---

```
npm build

npm publish
```

## 待办

---
