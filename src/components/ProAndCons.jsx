import React, { useState, useEffect, useRef } from "react";
import ProAndCon from "./ProAndCon";
import { withFirebase } from "../firebase/withFirebase";

const ProAndCons = props => {
  const { proAndConsCollection } = props.firebase;

  const proAndConsContainer = useRef(null);
  const [proAndCon, setProAndConInput] = useState("");
  const [proAndCons, setProAndCons] = useState([]);

  useEffect(() => {
    const unsubscribe = proAndConsCollection
      .orderBy("timestamp", "desc")
      .onSnapshot(({ docs }) => {
        const proAndConsFromDB = [];

        docs.forEach(doc => {
          const details = {
            id: doc.id,
            content: doc.data().proAndCon,
            timestamp: doc.data().timestamp,
            isDone: doc.data().isDone
          };

          proAndConsFromDB.push(details);
        });

        setProAndCons(proAndConsFromDB);
      });

    return () => unsubscribe();
  }, []);

  const onProAndConClear = event => {
    setProAndConInput("");
  };

  const onProAndConDelete = event => {
    const { id } = event.target;
    proAndConsCollection.doc(id).delete();
  };

  const onProAndConAdd = event => {
    event.preventDefault();

    if (!proAndCon.trim().length) return;

    setProAndConInput("");
    proAndConsContainer.current.scrollTop = 0; // scroll to top of container

    proAndConsCollection.add({ proAndCon, timestamp: new Date() });
  };

  const onProAndConDone = event => {
    const { id } = event.target;
    proAndConsCollection.doc(id).update({ isDone: 1 });
  };

  const onProAndConUndone = event => {
    const { id } = event.target;
    proAndConsCollection.doc(id).update({ isDone: 0 });
  };

  const renderProAndCons = () => {
    if (!proAndCons.length) return <h2 className="">Add a new ProAndCon...</h2>;

    return proAndCons.map(proAndCon => (
      <ProAndCon
        key={proAndCon.id}
        proAndCon={proAndCon}
        onDelete={onProAndConDelete}
        onDone={onProAndConDone}
        onUndone={onProAndConUndone}
      />
    ));
  };

  return (
    <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
      <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 ">
        <div className="mb-4">
          <h1 className="text-grey-darkest">ProAndCon List</h1>
          <div className="flex mt-4">
            <form onSubmit={onProAndConAdd} className="w-full max-w-lg">
              <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
                <input
                  value={proAndCon}
                  onChange={e => setProAndConInput(e.target.value)}
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
                  onClick={e => setProAndConInput("")}
                  className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        <div ref={proAndConsContainer}>{renderProAndCons()}</div>
      </div>
    </div>
  );
};

export default withFirebase(ProAndCons);
