import { dvReport } from "../global.js";

export default class Click {
  add(entry) {
    entry.el.addEventListener("click", function (e) {
      dvReport({
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
