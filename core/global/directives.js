import { autoSendTracker } from "../global/http.js";

class Click {
  add(entry) {
    entry.el.addEventListener("click", function (e) {
      console.log(entry.binding.value);
      autoSendTracker({
        ...entry.binding.value,
        x: e.clientX,
        y: e.clientY,
      });
    });
  }
  remove(entry) {
    entry.el.removeEventListener("click", () => {});
  }
}

class Keyup {
  add(entry) {
    entry.el.addEventListener("keyup", function (e) {
      if (e.keyCode === 13) {
        autoSendTracker(entry.binding.value);
      }
    });
  }
  remove(entry) {
    entry.el.removeEventListener("keyup", () => {});
  }
}

// 实例化曝光和点击
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
