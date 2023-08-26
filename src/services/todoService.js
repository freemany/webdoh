import { uuidv4 } from "../../../@webdoh/utils.js";
import { TODO_ITEM_SEPERATOR } from "../constants/index.js";

export const createTodo = (todoList, name) => [
  ...todoList,
  `${uuidv4(true)}${TODO_ITEM_SEPERATOR}${name}`,
];

export const deleteTodo = (todoList, id) =>
  todoList.filter((todo) => {
    const [itemId, name] = todo.split(TODO_ITEM_SEPERATOR);

    return itemId !== id;
  });

export const updateTodo = (todoList, id, value) => {
  return todoList.map((todo) => {
    const [itemId, _] = todo.split(TODO_ITEM_SEPERATOR);
    if (itemId === id) {
      return `${id}${TODO_ITEM_SEPERATOR}${value}`;
    }
    return todo;
  });
};
