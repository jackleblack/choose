import React, { useState, useEffect, useRef } from "react";
import Idea from "./Idea";
import { withFirebase } from "../firebase/withFirebase";

const Ideas = props => {
  const { ideasCollection } = props.firebase;

  const ideasContainer = useRef(null);
  const [idea, setIdeaInput] = useState("");
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const unsubscribe = ideasCollection
      .orderBy("timestamp", "desc")
      .onSnapshot(({ docs }) => {
        const ideasFromDB = [];

        docs.forEach(doc => {
          const details = {
            id: doc.id,
            content: doc.data().idea,
            timestamp: doc.data().timestamp,
            isDone: doc.data().isDone
          };

          ideasFromDB.push(details);
        });

        setIdeas(ideasFromDB);
      });

    return () => unsubscribe();
  }, []);

  const onIdeaClear = event => {
    setIdeaInput("");
  };

  const onIdeaDelete = event => {
    const { id } = event.target;
    ideasCollection.doc(id).delete();
  };

  const onIdeaAdd = event => {
    event.preventDefault();

    if (!idea.trim().length) return;

    setIdeaInput("");
    ideasContainer.current.scrollTop = 0; // scroll to top of container

    ideasCollection.add({ idea, timestamp: new Date() });
  };

  const onIdeaDone = event => {
    const { id } = event.target;
    ideasCollection.doc(id).update({isDone: 1});
  };

  const onIdeaUndone = event => {
    const { id } = event.target;
    ideasCollection.doc(id).update({isDone: 0});
  };

  const renderIdeas = () => {
    if (!ideas.length) return <h2 className="">Add a new Idea...</h2>;

    return ideas.map(idea => (
      <Idea key={idea.id} idea={idea} onDelete={onIdeaDelete} onDone={onIdeaDone} onUndone={onIdeaUndone} />
    ));
  };

  return (
    <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
      <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
        <div className="mb-4">
          <h1 className="text-grey-darkest">Todo List</h1>
          <div className="flex mt-4">
            <form onSubmit={onIdeaAdd} class="w-full max-w-sm">
              <div class="flex items-center border-b border-b-2 border-teal-500 py-2">
                <input value={idea}
                    onChange={e => setIdeaInput(e.target.value)} 
                    class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Fais ton lit" aria-label="Full name" />
                <button 
                class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                  Add
                </button>
                <button 
                onClick={e => setIdeaInput("")} 
                class="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded" type="button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        <div ref={ideasContainer}>{renderIdeas()}</div>
      </div>
    </div>
  );
};

export default withFirebase(Ideas);
