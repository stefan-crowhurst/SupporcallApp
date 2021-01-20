import React from 'react';
import { Toolbar } from "./components/toolbar";
import "./bstyles.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Tickets } from "./pages/tickets";
import { Agents } from "./pages/agents";
import { Contacts } from "./pages/contacts";
import { Reports } from "./pages/reports";


const App = () => {
  return (
    <div>
      <Router>
        <div style={{width: "100%"}}>
          <Toolbar />
        </div>

        <div style={{width:"100%", paddingLeft:"0.5%", paddingRight:"0.5%", paddingTop:"0.25%"}}>
          <Switch>
            <Route path="/tickets">
              <Tickets />
            </Route>
            <Route path="/agents">
              <Agents />
            </Route>
            <Route path="/contacts">
              <Contacts />
            </Route>
            <Route path="/reports">
              <Reports />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
