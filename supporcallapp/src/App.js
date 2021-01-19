import React from 'react';
import { Toolbar } from "./components/toolbar";
import "./bstyles.scss";

const App = () => {
  return (
    <div>
      <div style={{width: "100%"}}>
        <Toolbar />
      </div>
      <>content</>
    </div>
  );
}

export default App;
