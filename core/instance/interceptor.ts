class Interceptor {
  private handlers;
  constructor() {
    this.handlers = [];
  }

  // params promise then resolve reject
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected
    });
  }
}

export default Interceptor;