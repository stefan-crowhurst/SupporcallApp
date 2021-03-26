import React from 'react';
import "./bstyles.scss";
import Main from "./Main";
import { Store } from "./store";

const App = () => {
  return (
    // wrap entire app in store to ensure all areas have access
    <Store>
      <Main />
    </Store>
  );
}

export default App;
