import React from "react";

const Todo = ({ todo, onDelete, onDone, onUndone }) => (
  <div className="flex mb-4 items-center">
    <p
      className={`w-full " ${
        todo.isDone ? "text-green-500 line-through" : "text-grey-darkest"
      }`}
    >
      {todo.content}
    </p>
    {todo.isDone ? (
      <button
        id={todo.id}
        onClick={onUndone}
        className="flex-shrink-0 p-2 ml-4 mr-2 bg-grey-500 hover:bg-grey-700 border-grey-500 hover:border-grey-700 text-sm border-4 text-grey rounded"
        type="submit"
      >
        Undone
      </button>
    ) : (
      <button
        id={todo.id}
        onClick={onDone}
        className="flex-shrink-0 p-2 ml-4 mr-2 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white rounded"
        type="submit"
      >
        Done
      </button>
    )}

    <button
      id={todo.id}
      onClick={onDelete}
      className="flex-shrink-0 p-2 ml-2 mr-2 bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-sm border-4 text-white rounded"
      type="submit"
    >
      Delete
    </button>
  </div>
);

export default Todo;
