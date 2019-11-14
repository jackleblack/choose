import React, {useState, useEffect, useRef} from "react";
import Ideas from "./Ideas";
import {withFirebase} from "../firebase/withFirebase";
import * as theme from "../theme";
import "./App.less";

const App = props => {
  const [currentTheme, setCurrentTheme] = useState("lightTheme");

  const toggleTheme = () => {
    const newTheme = currentTheme === "lightTheme"
      ? "darkTheme"
      : "lightTheme";
    setCurrentTheme(newTheme);
  };

  useEffect(() => {
    const selectedTheme = theme[currentTheme];

    Object.keys(selectedTheme).forEach(variable => {
      document.documentElement.style.setProperty(variable, selectedTheme[variable]);
    });
  }, [currentTheme]);

  return (<div className="app">
    <header className="app__header">
      <h1 className="app__header__h1">Idea Box</h1>
      <button type="button" className="app__btn theme-toggle" onClick={toggleTheme}>
        {
          currentTheme === "lightTheme"
            ? "🌑"
            : "🌕"
        }
      </button>
    </header>

    <Ideas/>
  </div>);
};

export default withFirebase(App);
