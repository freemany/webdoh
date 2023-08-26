import TodoListComponent from "./components/todoListComponent.js";
import TodoItemComponent from "./components/todoItemComponent.js";
import BaseWebComponent from "./@webdoh/baseComponent.js";
import { setStoreData } from "./@webdoh/store.js";
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
      todoList: [],
      newTask: "",
      title: "Todo Demo",
    };
  }

  template() {
    return `<div class="container">
    <h1><%= title %></h1>
    <% if (newTask) { %>
    <h5>new task:<%=newTask %></h5>
    <% } %>
    <input type="text" ref="todoNameInput"/>
    <button class="new-task-btn" onclick="appOnclickHandler(this)">New</button>
    <todo-list data-todo-list="<%=todoList %>"></todo-list>
    <div><p><%=(new Date()).getTime() %></p><p><%=JSON.stringify(todoList) %></p></div>
    </div>`;
  }

  listeners() {
    return {
      // We can have onchange handler
      // appOnchangeHandler: (el) => {},
      appOnclickHandler: () => {
        // @TODO still bugy
        const value =
          this.refs.todoNameInput && this.refs.todoNameInput.value
            ? this.refs.todoNameInput.value.trim()
            : "";
        if (value) {
          this.data.todoList = createTodo(this.data.todoList, value);
          this.refs.todoNameInput.value = "";
          // setTimeout(() => (this.data.newTask = value), 200);
        }
      },
    };
  }
}
customElements.define("app-component", AppComponent);