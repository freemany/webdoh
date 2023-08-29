import BaseWebComponent from "../../../@webdoh/baseComponent.js";
import { getStoreData } from "../../../@webdoh/store.js";
import { TODO_ITEM_SEPERATOR } from "../constants/index.js";
import { deleteTodo, updateTodo } from "../services/todoService.js";
import { nextTick, getFuncNameWithHash } from "../../../@webdoh/utils.js";

export default class TodoItemComponent extends BaseWebComponent {
  static get observedAttributes() {
    return ["data-todo-item"];
  }
  constructor() {
    super();
  }

  init() {
    this.todoItemSaveHandler = getFuncNameWithHash("todoItemSaveHandler");
    this.todoItemOnclickHandler = getFuncNameWithHash("todoItemOnclickHandler");
    this.todoItemNameOnclickHandler = getFuncNameWithHash(
      "todoItemNameOnclickHandler"
    );
  }

  setData() {
    return {
      todoId: { default: null },
      todoName: { default: null },
      isEditing: { default: false, render: this.renderIsEditing.bind(this) },
      todoItemSaveHandler: { default: this.todoItemSaveHandler },
      todoItemNameOnclickHandler: { default: this.todoItemNameOnclickHandler },
    };
  }

  renderIsEditing(isEditing) {
    if (isEditing) {
      $(this.root).find(".is-editing").show();
      $(this.root).find(".todo-item-name").hide();
    } else {
      $(this.root).find(".todo-item-name").show();
      $(this.root).find(".is-editing").hide();
    }
  }

  template() {
    return `<li>
    <span style="display:none" class="is-editing">
    <input class="todo-item-name-input" value="<%=todoName %>" type="text" />
    <button class="todo-update-btn" todo-id="<%=todoId %>" onclick="<%=todoItemSaveHandler %>(this)">Save</button></span>
    </span>
    <span class="todo-item-name" onclick="<%=todoItemNameOnclickHandler %>(this)"><%=todoName %></span>
    <button class="todo-delete-btn" todo-id="<%=todoId %>" onclick="todoItemDeleteHandler(this)">x</button>
    </li>`;
  }

  listeners() {
    return {
      [this.todoItemNameOnclickHandler]: () => {
        this.data.isEditing = true;
      },
      [this.todoItemSaveHandler]: (el) => {
        const appData = getStoreData("appData");
        const id = el.getAttribute("todo-id");
        appData.todoList = updateTodo(
          appData.todoList,
          id,
          $(this.root).find(".todo-item-name-input").val()
        );
        nextTick(() => (this.data.isEditing = false));
      },
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
