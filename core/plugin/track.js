import Click from "./click.js";
import Keyup from "./keyup.js";
import Exposure from "./exposure.js";

// 实例化曝光和点击
const exp = new Exposure();
const cli = new Click();
const keyup = new Keyup();

const track = {
  inserted: function (el, binding) {
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

        case "exposure":
          exp.add({ el });
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

        case "exposure":
          exp.remove({ el, binding });
          break;
      }
    });
  },
};

export function setTrackDirectives(app) {
  app.directive("track", track);
}

export default track;
