import { uuidv4 } from "../../../@webdoh/utils.js";
import { TODO_ITEM_SEPARATOR } from "../constants/index.js";

export const createTodo = (todoList, name) => [
  ...todoList,
  `${uuidv4(true)}${TODO_ITEM_SEPARATOR}${name}`,
];

export const deleteTodo = (todoList, id) =>
  todoList.filter((todo) => {
    const [itemId, name] = todo.split(TODO_ITEM_SEPARATOR);

    return itemId !== id;
  });

export const updateTodo = (todoList, id, value) => {
  return todoList.map((todo) => {
    const [itemId, _] = todo.split(TODO_ITEM_SEPARATOR);
    if (itemId === id) {
      return `${id}${TODO_ITEM_SEPARATOR}${value}`;
    }
    return todo;
  });
};
