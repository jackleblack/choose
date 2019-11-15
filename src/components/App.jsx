import React, { useState, useEffect, useRef } from "react";
import Ideas from "./Ideas";
import Menu from "./Menu";
import Nav from "./Nav";
import { withFirebase } from "../firebase/withFirebase";

const App = props => {
  return (
    <div className="app">
      <Nav />
      <div className="flex flex-col md:flex-row">
        <Menu />
        <div className="main-content flex-1 bg-gray-100 mt-12 md:mt-2 pb-24 md:pb-5">
          <Ideas />
        </div>
      </div>
    </div>
  );
};

export default withFirebase(App);
