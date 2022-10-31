export default class Exposure {
  add(entry) {
    const pid = entry.el.attributes["track-pid"].value;
    const tp = entry.el.attributes["track-params"].value;
    console.log(entry.value)
  }
}
