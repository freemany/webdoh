import TodoListComponent from "./components/todoListComponent.js";
import TodoItemComponent from "./components/todoItemComponent.js";
import BaseWebComponent from "../@webdoh/baseComponent.js";
import { setStoreData } from "../@webdoh/store.js";
import { createTodo } from "./services/todoService.js";

class AppComponent extends BaseWebComponent {
  constructor() {
    super();
  }

  beforeMount() {
    setStoreData("appData", this.data);
  }

  setData() {
    return {
      title: "My Todo Demo",
      todoList: [],
    };
  }

  template() {
    return `<div class="container">
    <h1><%= title %></h1>
    <input type="text" ref="todoNameInput"/>
    <button class="new-task-btn" onclick="appOnclickHandler">New</button>
    <todo-list data-todo-list="<%=todoList %>"></todo-list>
    <p><span><%=(new Date()).getTime() %></span><br/><span><%=JSON.stringify(todoList) %></span></p>
    </div>`;
  }

  listeners() {
    return {
      appOnclickHandler: () => {
        const value =
          this.refs.todoNameInput && this.refs.todoNameInput.value
            ? this.refs.todoNameInput.value.trim()
            : "";
        if (value) {
          this.data.todoList = createTodo(this.data.todoList, value);
          this.refs.todoNameInput.value = "";
        }
      },
    };
  }
}
customElements.define("app-component", AppComponent);
