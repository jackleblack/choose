import React, { useState, useEffect, useRef } from "react";
import Todo from "./Todo";
import { withFirebase } from "../firebase/withFirebase";

const Todos = props => {
  const { ideasCollection } = props.firebase;

  const ideasContainer = useRef(null);
  const [todo, setTodoInput] = useState("");
  const [ideas, setTodos] = useState([]);

  useEffect(() => {
    const unsubscribe = ideasCollection
      .orderBy("timestamp", "desc")
      .onSnapshot(({ docs }) => {
        const ideasFromDB = [];

        docs.forEach(doc => {
          const details = {
            id: doc.id,
            content: doc.data().todo,
            timestamp: doc.data().timestamp,
            isDone: doc.data().isDone
          };

          ideasFromDB.push(details);
        });

        setTodos(ideasFromDB);
      });

    return () => unsubscribe();
  }, []);

  const onTodoClear = event => {
    setTodoInput("");
  };

  const onTodoDelete = event => {
    const { id } = event.target;
    ideasCollection.doc(id).delete();
  };

  const onTodoAdd = event => {
    event.preventDefault();

    if (!todo.trim().length) return;

    setTodoInput("");
    ideasContainer.current.scrollTop = 0; // scroll to top of container

    ideasCollection.add({ todo, timestamp: new Date() });
  };

  const onTodoDone = event => {
    const { id } = event.target;
    ideasCollection.doc(id).update({ isDone: 1 });
  };

  const onTodoUndone = event => {
    const { id } = event.target;
    ideasCollection.doc(id).update({ isDone: 0 });
  };

  const renderTodos = () => {
    if (!ideas.length) return <h2 className="">Add a new Todo...</h2>;

    return ideas.map(todo => (
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
              <div class="flex items-center border-b border-b-2 border-teal-500 py-2">
                <input
                  value={todo}
                  onChange={e => setTodoInput(e.target.value)}
                  class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="text"
                  placeholder="Fais ton lit"
                  aria-label="Full name"
                />
                <button
                  class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                  type="submit"
                >
                  Add
                </button>
                <button
                  onClick={e => setTodoInput("")}
                  class="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        <div ref={ideasContainer}>{renderTodos()}</div>
      </div>
    </div>
  );
};

export default withFirebase(Todos);
