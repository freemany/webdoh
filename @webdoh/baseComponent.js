import VDom from "./vDom.js";
import { getCss } from "./utils.js";
import _ from "./underscore.template.js";

export default class BaseWebComponent extends HTMLElement {
  constructor() {
    super();
    this.data = null;
    this.oVd = null;
    this.hash = null;
    this.init();
    this.root = this.attachShadow({ mode: "open" });
    this.initData(this.setData());
    this.hookListenersToWindow();
    this.beforeMount();
    // Load inline template style
    // this.loadCss();
  }

  connectedCallback() {
    this.render();
  }

  async addStyle(cssfile, root) {
    const style = document.createElement("style");
    const css = await getCss(cssfile);
    style.textContent = css;
    root.appendChild(style);
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
    // this.beforeRender();
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
      const firstChild = document.createElement("div");
      this.shadowRoot.appendChild(firstChild);
      this.root = vDom.mount(vDom.render(this.oVd), firstChild);
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
