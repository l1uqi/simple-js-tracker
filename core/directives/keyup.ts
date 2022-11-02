import { autoSendTracker } from "../global/http";

class Keyup {
  add(entry: { el: any; binding: any }) {
    entry.el.addEventListener("keyup", function (e) {
      if (e.keyCode === 13) {
        autoSendTracker(entry.binding.value);
      }
    });
  }
  remove(entry: { el: any; binding?: any }) {
    entry.el.removeEventListener("keyup", () => {});
  }
}


export default Keyup;