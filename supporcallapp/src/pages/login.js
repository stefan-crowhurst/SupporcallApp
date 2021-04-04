import axios from "axios";
import React, { useContext, useState } from "react";
import { Context } from '../store';
import { useHistory, useRouteMatch } from "react-router-dom";

export const Login = () => {
  const [_store, dispatch] = useContext(Context);
  let [userId, setUserId] = useState("");
  let [password, setPassword] = useState("");
  let match = useRouteMatch();
  const history = useHistory();

  return(
    <form class="box" onSubmit={(e) => {
      e.preventDefault();
      axios.post("https://supporcallapi.azurewebsites.net/api/Agents/login", { agentId: userId, password: password }).then((r) => {
        if (r.status === 200) {
          dispatch({type: "LOGGED_IN", payload: {loggedInAgentId: r.data.agentId, isAdminLoggedIn: r.data.isAdmin}});
          history.push(`${match.url.replace("login", "")}`);
        }
      }).catch(() => {
        alert("Login not completed, please check your details and try again");
      });
    }}>
      <div class="columns">
        <div class="column is-2">
          <span>User ID</span>
        </div>
        <div class="column">
          <input class="input" type="text" value={userId} onChange={(e) => {
            setUserId(e.target.value);
          }} />
        </div>
      </div>
      <div class="columns">
        <div class="column is-2">
          <span>Password</span>
        </div>
        <div class="column">
          <input class="input" type="password" value={password} onChange={(e) => {
            setPassword(e.target.value);
          }} />
        </div>
      </div>
      <div style={{width:"100%", textAlign:"center"}}>
        <button type="submit" class="button is-primary">Log In</button>
      </div>
    </form>
  );
}