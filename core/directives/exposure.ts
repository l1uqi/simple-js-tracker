import { autoSendTracker } from "../global/http";

class Exposure {
  private observer: IntersectionObserver | undefined;

  private params: Object = {};

  init() {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((item) => {
        if (item.isIntersecting) {
          observer!.unobserve(item.target);
          // 上报
          autoSendTracker({
            ...this.params,
          });
        }
      });
    });
  }
  add(entry: { el: Element; binding: any }) {
    this.params = entry.binding.value;
    if (!this.observer) {
      this.init();
    } else {
      this.observer.observe(entry.el);
    }
  }
  remove(entry: { el: Element; binding?: any }) {
    this.observer?.unobserve(entry.el);
    this.observer?.disconnect();
  }
}

export default Exposure;
