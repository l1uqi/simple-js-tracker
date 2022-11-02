import Click from "../directives/click";
import Keyup from "../directives/keyup";

// 实例化曝光和点击
const cli = new Click();
const keyup = new Keyup();

const track_v2 = {
  inserted: function (el: any, binding: { arg: any }) {
    const { arg } = binding;
    arg.split("|").forEach((item) => {
      // 点击
      switch (item) {
        case "click":
          cli.add({ el, binding });
          break;

        case "keyup":
          keyup.add({ el, binding });
          break;
      }
    });
  },
  unbind(el, binding) {
    const { arg } = binding;
    arg.split("|").forEach((item) => {
      // 点击
      switch (item) {
        case "click":
          cli.remove({ el, binding });
          break;

        case "keyup":
          keyup.remove({ el, binding });
          break;
      }
    });
  },
};

export function setTrackV2Directives(app) {
  app.directive("track", track_v2);
}

export default track_v2;
