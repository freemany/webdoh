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
      this.data.todoList = newValue ? newValue.split(",") : [];
    }
  }
}
customElements.define("todo-list", TodoListComponent);
