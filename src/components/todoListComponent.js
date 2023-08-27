import BaseWebComponent from "../../../@webdoh/baseComponent.js";

export default class TodoListComponent extends BaseWebComponent {
  static get observedAttributes() {
    return ["data-todo-list"];
  }
  constructor() {
    super();
  }

  setData() {
    return {
      todoList: { default: [] },
    };
  }

  template() {
    return `<ul>
      <% todoList.map((todo)=>{ %><todo-item data-todo-item="<%=todo %>"></todo-item><%}) %>
    </ul>`;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data-todo-list") {
      const o = oldValue ? oldValue.split(",") : [];
      const n = newValue ? newValue.split(",") : [];
      this.data.todoList = n;

      if (n.length > o.length) {
        const $li = $("<todo-item>").attr("data-todo-item", n[n.length - 1]);
        $(this.root).find("ul").append($li);

        return;
      }
      if (n.length < o.length) {
        const found = o.find((item) => !n.includes(item));
        if (found) {
          $(this.root).find(`todo-item[data-todo-item="${found}"]`).remove();
        }

        return;
      }

      for (let i = 0; i < o.length; i++) {
        if (n[i] !== o[i]) {
          $(this.root)
            .find(`todo-item[data-todo-item="${o[i]}"]`)
            .attr("data-todo-item", n[i]);
        }
      }
    }
  }
}
customElements.define("todo-list", TodoListComponent);
