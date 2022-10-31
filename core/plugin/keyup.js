import { dvRequest } from "../global.js";

export default class Keyup {
  add(entry) {
    entry.el.addEventListener("keyup", function (e) {
      if (e.keyCode === 13) {
        dvRequest(entry.binding.value);
      }
    });
  }
  remove(entry) {
    entry.el.removeEventListener("keyup", () => {})
  }
}
