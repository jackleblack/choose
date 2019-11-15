import React, { useState, useEffect, useRef } from "react";
import Todo from "./Todo";
import { withFirebase } from "../firebase/withFirebase";

const Todos = props => {
  const { todosCollection } = props.firebase;

  const todosContainer = useRef(null);
  const [todo, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const unsubscribe = todosCollection
      .orderBy("timestamp", "desc")
      .onSnapshot(({ docs }) => {
        const todosFromDB = [];

        docs.forEach(doc => {
          const details = {
            id: doc.id,
            content: doc.data().todo,
            timestamp: doc.data().timestamp,
            isDone: doc.data().isDone
          };

          todosFromDB.push(details);
        });

        setTodos(todosFromDB);
      });

    return () => unsubscribe();
  }, []);

  const onTodoClear = event => {
    setTodoInput("");
  };

  const onTodoDelete = event => {
    const { id } = event.target;
    todosCollection.doc(id).delete();
  };

  const onTodoAdd = event => {
    event.preventDefault();

    if (!todo.trim().length) return;

    setTodoInput("");
    todosContainer.current.scrollTop = 0; // scroll to top of container

    todosCollection.add({ todo, timestamp: new Date() });
  };

  const onTodoDone = event => {
    const { id } = event.target;
    todosCollection.doc(id).update({ isDone: 1 });
  };

  const onTodoUndone = event => {
    const { id } = event.target;
    todosCollection.doc(id).update({ isDone: 0 });
  };

  const renderTodos = () => {
    if (!todos.length) return <h2 className="">Add a new Todo...</h2>;

    return todos.map(todo => (
      <Todo
        key={todo.id}
        todo={todo}
        onDelete={onTodoDelete}
        onDone={onTodoDone}
        onUndone={onTodoUndone}
      />
    ));
  };

  return (
    <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
      <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 ">
        <div className="mb-4">
          <h1 className="text-grey-darkest">Todo List</h1>
          <div className="flex mt-4">
            <form onSubmit={onTodoAdd} class="w-full max-w-lg">
              <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
                <input
                  value={todo}
                  onChange={e => setTodoInput(e.target.value)}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="text"
                  placeholder="Fais ton lit"
                  aria-label="Full name"
                />
                <button
                  className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                  type="submit"
                >
                  Add
                </button>
                <button
                  onClick={e => setTodoInput("")}
                  className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        <div ref={todosContainer}>{renderTodos()}</div>
      </div>
    </div>
  );
};

export default withFirebase(Todos);
