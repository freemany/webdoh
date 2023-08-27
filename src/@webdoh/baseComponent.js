import _ from "./underscore.template.js";

export default class BaseWebComponent extends HTMLElement {
  constructor() {
    super();
    this.data = null;
    this.hash = null;
    this.init();
    this.initData(this.setData());
    this.hookListenersToWindow();
    this.beforeMount();
    this.root = document.createElement("div");
  }

  connectedCallback() {
    this.appendChild(this.root);
    this.initRender();
  }

  init() {}
  template() {}
  listeners() {
    return {};
  }
  beforeMount() {}
  beforeRender() {}
  afterRender() {}

  setData() {
    return {};
  }

  initRender() {
    const data = Object.keys(this.data).reduce((r, c) => {
      r[c] = this.data[c];
      return r;
    }, {});

    const tpl = this.template();
    const _temp = _.template(tpl)(data);
    this.root.innerHTML = _temp;
  }

  hookListenersToWindow() {
    const listeners = this.listeners();
    for (const key in listeners) {
      window[key] = listeners[key];
    }
  }

  initData(config) {
    this.data = new Proxy(
      Object.keys(config).reduce((r, c) => {
        r[c] = config[c].default;
        return r;
      }, {}),
      {
        set(obj, prop, value) {
          for (const key in config) {
            if (prop === key && typeof config[key].render === "function") {
              config[key].render(value);
            }
          }
          return Reflect.set(...arguments);
        },
      }
    );
  }
}
