import { dvReport } from "../global.js";

export default class Keyup {
  add(entry) {
    entry.el.addEventListener("keyup", function (e) {
      if (e.keyCode === 13) {
        dvReport(entry.binding.value);
      }
    });
  }
  remove(entry) {
    entry.el.removeEventListener("keyup", () => {})
  }
}
