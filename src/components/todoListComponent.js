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
      todoList: [],
    };
  }

  template() {
    return `<ul>
      <% todoList.map((todo)=>{ %><todo-item data-todo-item="<%=todo %>"></todo-item><%}) %>
    </ul>`;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data-todo-list") {
      const n = newValue.split(",");
      if (newValue) {
        this.data.todoList = n;
      } else {
        this.data.todoList = [];
      }
    }
  }
}
customElements.define("todo-list", TodoListComponent);
