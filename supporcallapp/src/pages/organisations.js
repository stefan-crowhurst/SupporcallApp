import React, { useEffect, useState, useContext } from 'react';
import "../bstyles.scss";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlus, faSync, faTrashAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Context } from '../store';

export const Organisations = () => {
  let [organisationList, setOrganisationList] = useState([]);
  let [currentOrganisation, setCurrentOrganisation] = useState();
  let [detailLoading, setDetailLoading] = useState(false);
  let [organisationEditMode, setOrganisationEditMode] = useState(false);
  let [organisationCreateMode, setOrganisationCreateMode] = useState(false);
  let [isLoading, setIsLoading] = useState(true);

  // react does not update the value props on html elements where the
  // value is set to a property of a stateful object, this means the form does
  // not update when using onChange/onInput. Since react doesn't support
  // two-way binding as of v15.0 this is the only (messy) solution unfortunately.
  // these fields will be used for both creation and updating since they are common in both.
  let [newName, setNewName] = useState("");
  let [newEmail, setNewEmail] = useState("");
  let [newPhoneNumber, setNewPhoneNumber] = useState("");
  let [newSLA, setNewSLA] = useState(false);
  
  const [store, dispatch] = useContext(Context);

  useEffect(() => {
    refreshOrganisationTable();
  }, []);

  function clearNewObject() {
    setNewName("");
    setNewEmail("");
    setNewPhoneNumber("");
    setNewSLA(false);
  }

  async function refreshOrganisationTable(isdelete) {
    setIsLoading(true);
    setOrganisationList([]); // this triggers the loading UI
    await axios.get("https://supporcallapi.azurewebsites.net/api/Organisations").then((i) => {
      setOrganisationList(i.data);
    }).then(() => {
      if (!isdelete && currentOrganisation && currentOrganisation.id.length > 0) {
        document.getElementById(currentOrganisation.id).classList.add('is-selected');
      }
      setIsLoading(false);
    });
  }

  async function refreshOrganisationDetails(e) {
    e.preventDefault(); // prevent page reload
    setDetailLoading(true);
    await axios.get("https://supporcallapi.azurewebsites.net/api/Organisations/" + currentOrganisation.id).then((c) => {
      setCurrentOrganisation(c.data);
      setDetailLoading(false);
    });
  }

  function createOrganisationClickRoutine(e) {
    e.preventDefault();
    setOrganisationCreateMode(true);
    // update table styling
    if (currentOrganisation && currentOrganisation.id && currentOrganisation.id !== e.id && currentOrganisation.id.length > 0) {
      document.getElementById(currentOrganisation.id).classList.remove('is-selected');
      clearNewObject();
      if (organisationEditMode) {
        setOrganisationEditMode(false);
      }
    }
  }

  return (
    <div class="columns" style={{width:"100%"}}>
      <div class="column">
        <div class="table-container box" style={{width:"100%"}}>
          {organisationList && organisationList.length > 0 ?
            <>
              <div class="level">
                <div class="level-left">
                  <h2 class="title is-4 level-item" style={{marginBottom:"0.4em"}}>All Organisations</h2>
                </div>
                <div class="level-right">
                  <button class="button is-rounded is-light level-item" onClick={async (e) => {
                    e.preventDefault(); // prevent page reload
                    refreshOrganisationTable(false);
                  }}>
                    <span class="icon"><FontAwesomeIcon icon={faSync} /></span>
                  </button>
                  <button class="button is-primary level-item" onClick={(e) => createOrganisationClickRoutine(e)}>
                    <span class="icon"><FontAwesomeIcon icon={faPlus} /></span>
                    <span>Create</span>
                  </button>
                </div>
              </div>
              <table class="table is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th><abbr title="Organisation ID">ID</abbr></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th><abbr title="Phone Number">Phone #</abbr></th>
                    <th><abbr title="Service Level Agreement?">SLA</abbr></th>
                  </tr>
                </thead>
                <tbody>
                  {organisationList.map((e) =>
                    <tr id={e.id} style={{cursor:"pointer"}} onClick={async () => {
                      // initiate loading display on detail panel
                      setDetailLoading(true);

                      // disable editing & creating modes to prevent data persisting between selections
                      setOrganisationEditMode(false);
                      setOrganisationCreateMode(false);

                      // update table styling
                      if (currentOrganisation && currentOrganisation.id && currentOrganisation.id !== e.id && currentOrganisation.id.length > 0) {
                        document.getElementById(currentOrganisation.id).classList.remove('is-selected');
                      }
                      document.getElementById(e.id).classList.add('is-selected');

                      // update detail view
                      await axios.get("https://supporcallapi.azurewebsites.net/api/Organisations/" + e.id).then((c) => {
                        setCurrentOrganisation(c.data);
                        setDetailLoading(false);
                      });
                    }}>
                      <th>{e.id}</th>
                      <td>{e.name}</td>
                      <td>{e.email}</td>
                      <td>{e.phoneNumber}</td>
                      <td><FontAwesomeIcon icon={e.sla ? faCheck : faTimes} /></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          : isLoading ?
          <div style={{width:"100%", textAlign:"center"}}>
            <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
            <h3><b>Loading organisations...</b></h3>
          </div>
          : !isLoading && organisationList.length === 0 ?
          <div style={{width:"100%"}}>
            <div class="level">
              <div class="level-left">
                <h2 class="title is-4 level-item" style={{marginBottom:"0.4em"}}>All Organisations</h2>
              </div>
              <div class="level-right">
                <button class="button is-rounded is-light level-item" onClick={async (e) => {
                  e.preventDefault(); // prevent page reload
                  refreshOrganisationTable();
                }}>
                  <span class="icon"><FontAwesomeIcon icon={faSync} /></span>
                </button>
                <button class="button is-primary level-item" onClick={(e) => createOrganisationClickRoutine(e)}>
                  <span class="icon"><FontAwesomeIcon icon={faPlus} /></span>
                  <span>Create</span>
                </button>
              </div>
            </div>
            <div class="notification is-warning"><b>No organisations to display, please create a organisation to continue</b></div>
          </div>
          :
          <div style={{width:"100%", textAlign:"center"}}>
            <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
            <h3><b>Attempting to load organisations</b></h3>
            <h3><b>An error may have occurred, please refresh the page or contact an administrator</b></h3>
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
          : (currentOrganisation && organisationEditMode) || organisationCreateMode ?
            // organisation detail editing view
            <div style={{width:"100%"}}>
              <div class="level">
                <div class="level-left">
                  <h2 class="title is-4 level-item" style={{marginBottom:"0.4em"}}>{organisationCreateMode ? <>Creating Organisation</> : <>Editing Organisation: {currentOrganisation.id}</>}</h2>
                </div>
                {!organisationCreateMode ?
                <div class="level-right">
                  <button class="button is-rounded is-dark level-item" onClick={(e) => {
                    e.preventDefault(); // prevent page reload
                    clearNewObject();
                    setOrganisationEditMode(!organisationEditMode);
                  }}>
                    <span class="icon"><FontAwesomeIcon icon={faPencilAlt} /></span>
                  </button>
                </div> : null}
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Name</span>
                </div>
                <div class="column">
                  <input class="input" type="text" value={newName} onChange={(e) => {
                    setNewName(e.target.value);
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
                  <span>Phone Number</span>
                </div>
                <div class="column">
                  <input class="input" type="text" value={newPhoneNumber} onChange={(e) => {
                    setNewPhoneNumber(e.target.value);
                  }} />
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>SLA</span>
                </div>
                <div class="column">
                  <div class="checkbox">
                    <input type="checkbox" checked={newSLA} onChange={(e) => {
                      setNewSLA(e.target.checked);
                    }} />
                  </div>
                </div>
              </div>
              <div style={{width:"100%", textAlign:"center"}}>
                { organisationCreateMode ? 
                  <button class="button is-primary" onClick={async (e) => {
                    e.preventDefault();
                    setDetailLoading(true);
                    setOrganisationCreateMode(false);
                    await axios.post("https://supporcallapi.azurewebsites.net/api/Organisations", {
                      name: newName,
                      email: newEmail,
                      phoneNumber: newPhoneNumber,
                      sla: newSLA ? 1 : 0,
                      requesterId: store.loggedInAgentId
                    }).then(() => {
                      setDetailLoading(false);
                      refreshOrganisationTable(false);
                      clearNewObject();
                      setCurrentOrganisation();
                    });
                  }}>Create Organisation</button>
                :
                  <button class="button is-primary" onClick={async (e) => {
                    e.preventDefault(); // prevent page reload
                    setDetailLoading(true);
                    setOrganisationEditMode(false);
                    await axios.post("https://supporcallapi.azurewebsites.net/api/Organisations/update", {
                      id : currentOrganisation.id,
                      name: newName,
                      email: newEmail,
                      phoneNumber: newPhoneNumber,
                      sla: newSLA ? 1 : 0,
                      requesterId: store.loggedInAgentId
                    }).then((r) => {
                      clearNewObject();
                      setCurrentOrganisation(r.data);
                      setDetailLoading(false);
                      refreshOrganisationTable(false);
                    });
                  }}>Update Organisation</button>
                }
              </div>
            </div>
          : currentOrganisation && !organisationEditMode ?
            // organisation detail viewing section
            <div style={{width:"100%"}}>
              <div class="level">
                <div class="level-left">
                  <h2 class="title is-4 level-item" style={{marginBottom:"0.4em"}}>Organisation: {currentOrganisation.id}</h2>
                </div>
                <div class="level-right">
                  <button class="button is-rounded is-light level-item" onClick={async (e) => refreshOrganisationDetails(e)}>
                    <span class="icon"><FontAwesomeIcon icon={faSync} /></span>
                  </button>
                  <button class="button is-rounded is-light level-item" onClick={(e) => {
                    e.preventDefault(); // prevent page reload
                    setNewName(currentOrganisation.name);
                    setNewEmail(currentOrganisation.email);
                    setNewPhoneNumber(currentOrganisation.phoneNumber);
                    setNewSLA(currentOrganisation.sla);
                    setOrganisationEditMode(!organisationEditMode);
                  }}>
                    <span class="icon"><FontAwesomeIcon icon={faPencilAlt} /></span>
                  </button>
                  <button class="button is-rounded is-light level-item" onClick={async (e) => {
                    e.preventDefault(); // prevent page reload
                    await axios.delete(`https://supporcallapi.azurewebsites.net/api/Organisations/${store.loggedInAgentId}/${currentOrganisation.id}`).then(() => {
                      setCurrentOrganisation();
                      refreshOrganisationTable(true);
                    });
                  }}>
                    <span class="icon"><FontAwesomeIcon icon={faTrashAlt} /></span>
                  </button>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Name</span>
                </div>
                <div class="column">
                  <label>{currentOrganisation.name ? currentOrganisation.name : "No name set"}</label>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Email</span>
                </div>
                <div class="column">
                  <label>{currentOrganisation.email ? currentOrganisation.email : "No email set"}</label>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Phone Number</span>
                </div>
                <div class="column">
                  <label>{currentOrganisation.phoneNumber ? currentOrganisation.phoneNumber : "No phone number set"}</label>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>SLA</span>
                </div>
                <div class="column">
                  <label><FontAwesomeIcon icon={currentOrganisation.sla ? faCheck : faTimes} /></label>
                </div>
              </div>
            </div>
          :
            <div style={{width:"100%"}}>
              <h2 class="title is-4">No organisation selected</h2>
              <h3 class="subtitle is-6">Please select or create a organisation from the table panel</h3>
            </div>
          }
        </div>
      </div>
    </div>
  );
}