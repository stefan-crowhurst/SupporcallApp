import React, { useEffect, useState } from 'react';
import "../bstyles.scss";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPencilAlt, faPlus, faSync, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export const Agents = () => {
  let [agentList, setAgentList] = useState([]);
  let [currentAgent, setCurrentAgent] = useState();
  let [detailLoading, setDetailLoading] = useState(false);
  let [agentEditMode, setAgentEditMode] = useState(false);
  let [agentCreateMode, setAgentCreateMode] = useState(false);

  // react does not update the value props on html elements where the
  // value is set to a property of a stateful object, this means the form does
  // not update when using onChange/onInput. Since react doesn't support
  // two-way binding as of v15.0 this is the only (messy) solution unfortunately.
  // these fields will be used for both creation and updating since they are common in both.
  let [newForename, setNewForename] = useState("");
  let [newSurname, setNewSurname] = useState("");
  let [newEmail, setNewEmail] = useState("");
  let [newPassword, setNewPassword] = useState("");
  let [newRole, setNewRole] = useState("");
  let [newAdmin, setNewAdmin] = useState(false); //TODO: js treats booleans kinda weird, need to check this works fine

  useEffect(() => {
    refreshAgentTable();
  }, []);

  function clearNewObject() {
    setNewForename("");
    setNewSurname("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("");
    setNewAdmin("");
  }

  async function refreshAgentTable(isdelete) {
    setAgentList([]); // this triggers the loading UI
    await axios.get("https://supporcallapi.azurewebsites.net/api/Agents").then((i) => {
      setAgentList(i.data);
    }).then(() => {
      if (!isdelete && currentAgent && currentAgent.id.length > 0) {
        document.getElementById(currentAgent.id).classList.add('is-selected');
      }
    });
  }

  async function refreshAgentDetails(e) {
    e.preventDefault(); // prevent page reload
    setDetailLoading(true);
    await axios.get("https://supporcallapi.azurewebsites.net/api/Agents/" + currentAgent.id).then((a) => {
      setCurrentAgent(a.data);
      setDetailLoading(false);
    });
  }

  return (
    <div class="columns" style={{width:"100%"}}>
      <div class="column">
        <div class="table-container box" style={{width:"100%"}}>
          {agentList && agentList.length > 0 ?
            <>
              <div class="level">
                <div class="level-left">
                  <h2 class="title is-4 level-item" style={{marginBottom:"0.4em"}}>All Agents</h2>
                </div>
                <div class="level-right">
                  <button class="button is-rounded is-light level-item" onClick={async (e) => {
                    e.preventDefault(); // prevent page reload
                    refreshAgentTable(false);
                  }}>
                    <span class="icon"><FontAwesomeIcon icon={faSync} /></span>
                  </button>
                  <button class="button is-primary level-item" onClick={(e) => {
                    e.preventDefault();
                    setAgentCreateMode(true);
                    // update table styling
                    if (currentAgent && currentAgent.id && currentAgent.id !== e.id && currentAgent.id.length > 0) {
                      document.getElementById(currentAgent.id).classList.remove('is-selected');
                      if (agentEditMode) {
                        clearNewObject();
                        setAgentEditMode(false);
                      }
                    }
                  }}>
                    <span class="icon"><FontAwesomeIcon icon={faPlus} /></span>
                    <span>Create</span>
                  </button>
                </div>
              </div>
              <table class="table is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th><abbr title="Agent ID">ID</abbr></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th><abbr title="Has Administrator Privilege?">Admin?</abbr></th>
                  </tr>
                </thead>
                <tbody>
                  {agentList.map((e) =>
                    <tr id={e.id} style={{cursor:"pointer"}} onClick={async () => {
                      // initiate loading display on detail panel
                      setDetailLoading(true);

                      // disable editing & creating modes to prevent data persisting between selections
                      setAgentEditMode(false);
                      setAgentCreateMode(false);

                      // update table styling
                      if (currentAgent && currentAgent.id && currentAgent.id !== e.id && currentAgent.id.length > 0) {
                        document.getElementById(currentAgent.id).classList.remove('is-selected');
                      }
                      document.getElementById(e.id).classList.add('is-selected');

                      // update detail view
                      await axios.get("https://supporcallapi.azurewebsites.net/api/Agents/" + e.id).then((c) => {
                        setCurrentAgent(c.data);
                        setDetailLoading(false);
                      });
                    }}>
                      <th>{e.id}</th>
                      <td>{e.forename} {e.surname}</td>
                      <td>{e.email}</td>
                      <td>{e.role}</td>
                      <td><FontAwesomeIcon icon={e.admin ? faCheck : faTimes} /></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          :
          <div style={{width:"100%", textAlign:"center"}}>
            <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
            <h3><b>Loading agents...</b></h3>
          </div>}
        </div>
      </div>
      <div class="column">
        <div class="box" style={{width:"100%"}}>
          {detailLoading ?
          <div style={{width:"100%", textAlign:"center"}}>
            <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
            <h3><b>Loading details...</b></h3>
          </div>
          : (currentAgent && agentEditMode) || agentCreateMode ?
            // agent detail editing view
            <div style={{width:"100%"}}>
              <div class="level">
                <div class="level-left">
                  <h2 class="title is-4 level-item" style={{marginBottom:"0.4em"}}>{agentCreateMode ? <>Creating Agent</> : <>Editing Agent: {currentAgent.id}</>}</h2>
                </div>
                {!agentCreateMode ?
                <div class="level-right">
                  <button class="button is-rounded is-dark level-item" onClick={(e) => {
                    e.preventDefault(); // prevent page reload
                    clearNewObject();
                    setAgentEditMode(!agentEditMode);
                  }}>
                    <span class="icon"><FontAwesomeIcon icon={faPencilAlt} /></span>
                  </button>
                </div> : null}
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Forename</span>
                </div>
                <div class="column">
                  <input class="input" type="text" value={newForename} onChange={(e) => {
                    setNewForename(e.target.value);
                  }} />
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Surname</span>
                </div>
                <div class="column">
                  <input class="input" type="text" value={newSurname} onChange={(e) => {
                    setNewSurname(e.target.value);
                  }} />
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Email</span>
                </div>
                <div class="column">
                  <input class="input" type="text" value={newEmail} onChange={(e) => {
                    setNewEmail(e.target.value);
                  }} />
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Password</span>
                </div>
                <div class="column">
                  <input class="input" type="text" value={newPassword} onChange={(e) => {
                    setNewPassword(e.target.value);
                  }} />
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Role</span>
                </div>
                <div class="column">
                  <input class="input" type="text" value={newRole} onChange={(e) => {
                    setNewRole(e.target.value);
                  }} />
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Is Administrator?</span>
                </div>
                <div class="column">
                  <div class="checkbox">
                  <input type="checkbox" checked={newAdmin} onChange={(e) => {
                    console.log(e);
                    setNewAdmin(e.target.checked);
                  }} />
                  </div>
                </div>
              </div>
              <div style={{width:"100%", textAlign:"center"}}>
                { agentCreateMode ? 
                  <button class="button is-primary" onClick={async (e) => {
                    e.preventDefault();
                    setDetailLoading(true);
                    setAgentCreateMode(false);
                    let byteConvertAdmin = 0;
                    if (newAdmin)
                    {
                      byteConvertAdmin = 1;
                    }
                    await axios.post("https://supporcallapi.azurewebsites.net/api/Agents", {
                      forename: newForename,
                      surname: newSurname,
                      email: newEmail,
                      password: newPassword,
                      role: newRole,
                      admin: byteConvertAdmin
                    }).then(() => {
                      setDetailLoading(false);
                      refreshAgentTable(false);
                      clearNewObject();
                      setCurrentAgent();
                    });
                  }}>Create Agent</button>
                :
                  <button class="button is-primary" onClick={async (e) => {
                    e.preventDefault(); // prevent page reload
                    setDetailLoading(true);
                    setAgentEditMode(false);
                    let byteConvertAdmin = 0;
                    if (newAdmin)
                    {
                      byteConvertAdmin = 1;
                    }
                    await axios.post("https://supporcallapi.azurewebsites.net/api/Agents/update", {
                      id : currentAgent.id,
                      forename: newForename,
                      surname: newSurname,
                      email: newEmail,
                      password: newPassword,
                      role: newRole,
                      admin: byteConvertAdmin
                    }).then((r) => {
                      setCurrentAgent(r.data);
                      setDetailLoading(false);
                      refreshAgentTable(false);
                    });
                  }}>Update Agent</button>
                }
              </div>
            </div>
          : currentAgent && !agentEditMode ?
            // agent detail viewing section
            <div style={{width:"100%"}}>
              <div class="level">
                <div class="level-left">
                  <h2 class="title is-4 level-item" style={{marginBottom:"0.4em"}}>Agent: {currentAgent.id}</h2>
                </div>
                <div class="level-right">
                  <button class="button is-rounded is-light level-item" onClick={async (e) => refreshAgentDetails(e)}>
                    <span class="icon"><FontAwesomeIcon icon={faSync} /></span>
                  </button>
                  <button class="button is-rounded is-light level-item" onClick={(e) => {
                    e.preventDefault(); // prevent page reload
                    setNewForename(currentAgent.forename);
                    setNewSurname(currentAgent.surname);
                    setNewEmail(currentAgent.email);
                    setNewPassword(currentAgent.password);
                    setNewRole(currentAgent.role);
                    setNewAdmin(currentAgent.admin);
                    setAgentEditMode(!agentEditMode);
                  }}>
                    <span class="icon"><FontAwesomeIcon icon={faPencilAlt} /></span>
                  </button>
                  <button class="button is-rounded is-light level-item" onClick={async (e) => {
                    e.preventDefault(); // prevent page reload
                    await axios.delete("https://supporcallapi.azurewebsites.net/api/Agents/" + currentAgent.id).then(() => {
                      setCurrentAgent();
                      refreshAgentTable(true);
                    });
                  }}>
                    <span class="icon"><FontAwesomeIcon icon={faTrashAlt} /></span>
                  </button>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Forename</span>
                </div>
                <div class="column">
                  <label>{currentAgent.forename ? currentAgent.forename : "No forename set"}</label>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Surname</span>
                </div>
                <div class="column">
                  <label>{currentAgent.surname ? currentAgent.surname : "No surname set"}</label>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Email</span>
                </div>
                <div class="column">
                  <label>{currentAgent.email ? currentAgent.email : "No email set"}</label>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Role</span>
                </div>
                <div class="column">
                  <label>{currentAgent.role ? currentAgent.role : "No role set"}</label>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Is Administrator?</span>
                </div>
                <div class="column">
                  <label><FontAwesomeIcon icon={currentAgent.admin ? faCheck : faTimes} /></label>
                </div>
              </div>
            </div>
          :
            <div style={{width:"100%"}}>
              <h2 class="title is-4">No agent selected</h2>
              <h3 class="subtitle is-6">Please select or create an agent from the table panel</h3>
            </div>
          }
        </div>
      </div>
    </div>
  );
}