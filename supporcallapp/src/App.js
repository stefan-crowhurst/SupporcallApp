import React from 'react';
import { Toolbar } from "./components/toolbar";
import "./bstyles.scss";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Router>
        <div style={{width: "100%"}}>
          <Toolbar />
        </div>

        <Switch>
          <Route path="/tickets">
            <>tickets</>
          </Route>
          <Route path="/agents">
            <>agents</>
          </Route>
          <Route path="/contacts">
            <>contacts</>
          </Route>
          <Route path="/reports">
            <>reports</>
          </Route>
          <Route path="/">
            <>home</>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
