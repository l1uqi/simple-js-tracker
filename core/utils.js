export const cConsole = function (params) {
  const { text, type = "log", debug = false } = params
  debug && console[type](text);
};