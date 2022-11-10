import { autoSendTracker } from "../global/http"

const attrName = "exposure-data";

class Exposure {
  private observer: IntersectionObserver | undefined;

  init() {
    return new IntersectionObserver((entries, observer) => {
      entries.forEach((item) => {
        if (item.isIntersecting) {
          const el: Element = item.target;
          observer!.unobserve(el);
          const arrtString = el.getAttribute(attrName) || null;
          if (!arrtString) return;
          const params = JSON.parse(arrtString);
          // 上报
          autoSendTracker({
            ...params,
          });
        }
      });
    });
  }
  add(entry: { el: Element; binding: any }) {
    entry.el.setAttribute(
      attrName,
      typeof entry.binding.value === "string"
        ? entry.binding.value
        : JSON.stringify(entry.binding.value)
    );
    if (this.observer === undefined) {
      this.observer = this.init();
    }
    this.observer.observe(entry.el);
  }
  remove(entry: { el: Element; binding?: any }) {
    this.observer?.unobserve(entry.el);
    this.observer?.disconnect();
  }
}

export default Exposure;
