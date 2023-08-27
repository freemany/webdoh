import BaseWebComponent from "../@webdoh/baseComponent.js";
import { getStoreData } from "../@webdoh/store.js";
import { TODO_ITEM_SEPERATOR } from "../constants/index.js";
import { deleteTodo } from "../services/todoService.js";

export default class TodoItemComponent extends BaseWebComponent {
  static get observedAttributes() {
    return ["data-todo-item"];
  }
  constructor() {
    super();
  }

  setData() {
    return {
      todoId: { default: null },
      todoName: { default: null },
    };
  }

  template() {
    return `<li>
    <span class="todo-item-name"><%=todoName %></span>
    <button class="todo-delete-btn" todo-id="<%=todoId %>" onclick="todoItemDeleteHandler(this)">x</button>
    </li>`;
  }

  listeners() {
    return {
      todoItemDeleteHandler: (el) => {
        const appData = getStoreData("appData");
        const id = el.getAttribute("todo-id");
        if (id) {
          const deletedTodoList = deleteTodo(appData.todoList, id);
          if (appData.todoList.length > deletedTodoList.length) {
            appData.todoList = deletedTodoList;
          }
        }
      },
    };
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue) {
      const [id, name] = newValue
        ? newValue.split(TODO_ITEM_SEPERATOR)
        : [null, null];
      this.data.todoId = id;
      this.data.todoName = name;
    }
  }
}
customElements.define("todo-item", TodoItemComponent);
