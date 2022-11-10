import { autoSendTracker } from "../global/http";

class Click {
  add(entry: { el: any; binding: any; }) {
    // this => template
    entry.el.addEventListener("click", function (e) {
      autoSendTracker({
        ...entry.binding.value,
        x: e.clientX,
        y: e.clientY,
      });
    });
  }
  remove(entry: { el: any; binding?: any; }) {
    entry.el.removeEventListener("click", () => {});
  }
}

export default Click;