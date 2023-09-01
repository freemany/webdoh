import BaseWebComponent from "../../../@webdoh/baseComponent.js";
import { getStoreData } from "../../../@webdoh/store.js";
import { getCss, nextTick } from "../../../@webdoh/utils.js";
import { TODO_ITEM_SEPERATOR } from "../constants/index.js";
import { deleteTodo, updateTodo } from "../services/todoService.js";

export default class TodoItemComponent extends BaseWebComponent {
  static get observedAttributes() {
    return ["data-todo-item"];
  }
  constructor() {
    super();
  }

  async beforeRender() {
    const style = document.createElement("style");
    const css = await getCss("./src/components/todoItemComponent.css");
    style.textContent = css;
    this.root.appendChild(style);
  }

  setData() {
    return {
      todoId: null,
      todoName: null,
      isEditing: false,
    };
  }

  template() {
    return `<li>
    <% if (isEditing) { %>
    <span><input value="<%=todoName %>" type="text" ref="todoNameInput" />
    <button class="todo-update-btn" todo-id="<%=todoId %>" onclick="todoItemOnclickHandler">Save</button></span>
    <% } else { %>
    <span class="todo-item-name" onclick="todoItemNameOnclickHandler"><%=todoName %></span>
    <% } %>  
    <button class="todo-delete-btn" todo-id="<%=todoId %>" onclick="todoItemDeleteHandler">x</button>
    </li>`;
  }

  listeners() {
    return {
      todoItemNameOnclickHandler: () => {
        this.data.isEditing = true;
      },
      todoItemOnclickHandler: (e) => {
        const appData = getStoreData("appData");
        const id = e.target.getAttribute("todo-id");
        appData.todoList = updateTodo(
          appData.todoList,
          id,
          this.refs.todoNameInput.value
        );
        nextTick(() => (this.data.isEditing = false));
      },
      todoItemDeleteHandler: (e) => {
        const appData = getStoreData("appData");
        const id = e.target.getAttribute("todo-id");
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
