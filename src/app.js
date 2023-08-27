import TodoListComponent from "./components/todoListComponent.js";
import TodoItemComponent from "./components/todoItemComponent.js";
import BaseWebComponent from "./@webdoh/baseComponent.js";
import { createTodo } from "./services/todoService.js";
import { setStoreData } from "./@webdoh/store.js";

class AppComponent extends BaseWebComponent {
  constructor() {
    super();
  }

  beforeMount() {
    setStoreData("appData", this.data);
  }

  setData() {
    return {
      title: { default: "My Todo Demo" },
      todoList: { default: [], render: this.renderTodoList.bind(this) },
    };
  }

  renderTodoList(data) {
    this.root.querySelector("todo-list").setAttribute("data-todo-list", data);
    $(this.root).find(".todo-list-log").text(data);
  }

  template() {
    return `<div class="container">
    <h1><%= title %></h1>
    <input type="text" class="todo-name-input" />
    <button class="new-task-btn" onclick="appOnclickHandler(this)">New</button>
    <todo-list data-todo-list="<%=todoList %>"></todo-list>
    <div><p><%=(new Date()).getTime() %></p><p class="todo-list-log"><%=JSON.stringify(todoList) %></p></div>
    </div>`;
  }

  listeners() {
    return {
      appOnclickHandler: (el) => {
        const $input = $(this.root).find(".todo-name-input");
        const value = $input.val().trim();
        if (value) {
          this.data.todoList = createTodo(this.data.todoList, value);
          $input.val("");
        }
      },
    };
  }
}
customElements.define("app-component", AppComponent);
