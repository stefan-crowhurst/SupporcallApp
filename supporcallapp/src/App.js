import React from 'react';
import "./bstyles.scss";
import Main from "./Main";
import { Store } from "./store";

const App = () => {
  return (
    <Store>
      <Main />
    </Store>
  );
}

export default App;
