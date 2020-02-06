export class UrlParams {
  constructor(url = "") {
    if (url.includes("?")) {
      url = url.substring(url.lastIndexOf("?") + 1).trim();
    }
    this.params = (/^[?#]/.test(url) ? url.slice(1) : url)
      .split("&")
      .reduce((params, param) => {
        let [key, value] = param.split("=");
        params[key] = value
          ? decodeURIComponent(value.replace(/\+/g, " "))
          : "";
        return params;
      }, {});
  }

  get = name => {
    return this.params[name];
  };
}
