import React, { useContext } from 'react';
import { Toolbar } from "./components/toolbar";
import "./bstyles.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Tickets } from "./pages/tickets";
import { Agents } from "./pages/agents";
import { Contacts } from "./pages/contacts";
import { Reports } from "./pages/reports";
import { Organisations } from "./pages/organisations";
import { Login } from "./pages/login";
import { Context } from "./store";
import { LoginWarning } from './pages/loginwarning';

const Main = () => {
  const [store] = useContext(Context);

  return (
      <Router>
        <div style={{width: "100%"}}>
          <Toolbar />
        </div>

        <div style={{width:"100%", paddingLeft:"0.5%", paddingRight:"0.5%", paddingTop:"0.25%"}}>
          <Switch>
            <Route path="/tickets">
              {store.loggedIn ? <Tickets />
              : <LoginWarning />}
            </Route>
            <Route path="/agents">
              {store.loggedIn ? <Agents />
              : <LoginWarning />}
            </Route>
            <Route path="/contacts">
              {store.loggedIn ? <Contacts />
              : <LoginWarning />}
            </Route>
            <Route path="/reports">
              {store.loggedIn ? <Reports />
              : <LoginWarning />}
            </Route>
            <Route path="/organisations">
              {store.loggedIn ? <Organisations />
              : <LoginWarning />}
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              {store.loggedIn ? <Home />
              : <LoginWarning />}
            </Route>
          </Switch>
        </div>
      </Router>
  );
}

export default Main;
