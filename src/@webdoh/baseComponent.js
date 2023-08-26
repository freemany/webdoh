import VDom from "./vDom.js";
import { getCss } from "./utils.js";
import _ from "./underscore.template.js";

const bootstrapCssUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.1/css/bootstrap.min.css";

export default class BaseWebComponent extends HTMLElement {
  constructor() {
    super();
    this.data = null;
    this.oVd = null;
    this.hash = null;
    this.init();
    this.initData(this.setData());
    this.hookListenersToWindow();
    this.beforeMount();
    this.root = document.createElement("div");
    // Load inline template style
    // this.loadCss();
  }

  connectedCallback() {
    this.appendChild(this.root);
    this.render();
  }

  async loadCss() {
    const styles = document.createElement("style");
    this.root.appendChild(styles);
    const css = await getCss(bootstrapCssUrl);
    styles.textContent = css;
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

  render() {
    this.beforeRender();
    const data = Object.keys(this.data).reduce((r, c) => {
      r[c] = this.data[c];
      return r;
    }, {});

    const vDom = VDom();
    const tpl = this.template();
    const parser = new DOMParser();
    const doc = parser.parseFromString(_.template(tpl)(data), "text/html");
    const el = doc.body.firstChild;
    const vd = vDom.create(el);

    if (!this.oVd) {
      this.oVd = vd;
      this.root = vDom.mount(vDom.render(this.oVd), this.root);
    } else {
      this.nVd = vd;
      vDom.update(this.oVd, this.nVd, this.root);
      this.oVd = this.nVd;
    }
    this.refs = vDom.getRefs();
    this.afterRender();
  }

  hookListenersToWindow() {
    const listeners = this.listeners();
    for (const key in listeners) {
      window[key] = listeners[key];
    }
  }

  initData(config) {
    const _this = this;
    this.data = new Proxy(
      Object.keys(config).reduce((r, c) => {
        r[c] = config[c];
        return r;
      }, {}),
      {
        set(obj, prop, value) {
          Reflect.set(...arguments);
          _this.render();
          return true;
        },
      }
    );
  }
}
