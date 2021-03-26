import axios from "axios";
import React, { useContext, useState } from "react";
import { Context } from '../store';
import { useHistory, useRouteMatch } from "react-router-dom";

/**
 * Simple login screen page for agents
 * 
 * @returns Login screen page
 */
export const Login = () => {
  const [_store, dispatch] = useContext(Context);
  let [userId, setUserId] = useState("");
  let [password, setPassword] = useState("");
  let match = useRouteMatch();
  const history = useHistory();

  return(
    <div class="box">
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
        <button class="button is-primary" onClick={(e) => {
          axios.post("https://supporcallapi.azurewebsites.net/api/Agents/login", { agentId: userId, password: password }).then((r) => {
            // Check ID and password against database and update state accordingly
            if (r.status === 200) {
              dispatch({type: "LOGGED_IN", payload: {loggedInAgentId: r.data.agentId, isAdminLoggedIn: r.data.isAdmin}});
              history.push(`${match.url.replace("login", "")}`);
            }
          }).catch(() => {
            alert("Login not completed, please check your details and try again");
          });
        }}>Log In</button>
      </div>
    </div>
  );
}