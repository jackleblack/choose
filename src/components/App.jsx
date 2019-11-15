import React, { useState, useEffect, useRef } from "react";
import Todos from "./Todos";
import ProAndCons from "./ProAndCons";
import Menu from "./Menu";
import Nav from "./Nav";
import { withFirebase } from "../firebase/withFirebase";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = props => {
  return (
    <Router>
      <div className="app">
        <Nav />
        <div className="flex flex-col md:flex-row">
          <Menu />
          <div className="main-content flex-1 bg-gray-100 mt-12 md:mt-2 pb-24 md:pb-5">
            <Switch>
              <Route path="/todos">
                <Todos />
              </Route>
              <Route path="/proandcons">
                <ProAndCons />
              </Route>
              <Route path="/">
                <Todos />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default withFirebase(App);
