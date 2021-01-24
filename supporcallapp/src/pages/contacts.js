import React, { useEffect, useState } from 'react';
import "../bstyles.scss";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlus, faSync } from '@fortawesome/free-solid-svg-icons';

export const Contacts = () => {
  let [contactList, setContactList] = useState([]);
  let [currentContact, setCurrentContact] = useState();
  let [detailLoading, setDetailLoading] = useState(false);
  let [contactEditMode, setContactEditMode] = useState(false);
  let [contactCreateMode, setContactCreateMode] = useState(false);

  // react does not update the value props on html elements where the
  // value is set to a property of a stateful object, this means the form does
  // not update when using onChange/onInput. Since react doesn't support
  // two-way binding as of v15.0 this is the only (messy) solution unfortunately.
  // these fields will be used for both creation and updating since they are common in both.
  let [newForename, setNewForename] = useState("");
  let [newSurname, setNewSurname] = useState("");
  let [newRole, setNewRole] = useState("");
  let [newEmail, setNewEmail] = useState("");
  let [newPhoneNumber, setNewPhoneNumber] = useState("");
  let [newOrgId, setNewOrgId] = useState("");

  useEffect(() => {
    // async await moved to internal function to prevent useEffect race conditions
    // lambda can't be used, so a simply named local function is defined instead
    async function x() {
      await axios.get("https://supporcallapi.azurewebsites.net/api/Contacts").then((i) => {
        setContactList(i.data);
      });
    }
    x();
  }, []);

  function clearNewObject() {
    setNewForename("");
    setNewSurname("");
    setNewRole("");
    setNewEmail("");
    setNewPhoneNumber("");
    setNewOrgId("");
  }

  async function refreshContactTable() {
    setContactList([]); // this triggers the loading UI
    await axios.get("https://supporcallapi.azurewebsites.net/api/Contacts").then((i) => {
      setContactList(i.data);
    });
  }

  async function refreshContactDetails(e) {
    e.preventDefault(); // prevent page reload
    setDetailLoading(true);
    await axios.get("https://supporcallapi.azurewebsites.net/api/Contacts/" + currentContact.id).then((c) => {
      setCurrentContact(c.data);
      setDetailLoading(false);
    });
  }

  return (
    <div class="columns" style={{width:"100%"}}>
      <div class="column">
        <div class="table-container box" style={{width:"100%"}}>
          {contactList && contactList.length > 0 ?
            <>
              <div class="level">
                <div class="level-left">
                  <h2 class="title is-4 level-item" style={{marginBottom:"0.4em"}}>All Contacts</h2>
                </div>
                <div class="level-right">
                  <button class="button is-rounded is-light level-item" onClick={async (e) => {
                    e.preventDefault(); // prevent page reload
                    refreshContactTable(e);
                  }}>
                    <span class="icon"><FontAwesomeIcon icon={faSync} /></span>
                  </button>
                  <button class="button is-primary level-item" onClick={(e) => {
                    e.preventDefault();
                    setContactCreateMode(true);
                    // update table styling
                    if (currentContact && currentContact.id && currentContact.id !== e.id && currentContact.id.length > 0) {
                      document.getElementById(currentContact.id).classList.remove('is-selected');
                      if (contactEditMode) {
                        clearNewObject();
                        setContactEditMode(false);
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
                    <th><abbr title="Contact ID">ID</abbr></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th><abbr title="Organisation">Org.</abbr></th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {contactList.map((e) =>
                    <tr id={e.id} style={{cursor:"pointer"}} onClick={async () => {
                      // initiate loading display on detail panel
                      setDetailLoading(true);

                      // disable editing & creating modes to prevent data persisting between selections
                      setContactEditMode(false);
                      setContactCreateMode(false);

                      // update table styling
                      if (currentContact && currentContact.id && currentContact.id !== e.id && currentContact.id.length > 0) {
                        document.getElementById(currentContact.id).classList.remove('is-selected');
                      }
                      document.getElementById(e.id).classList.add('is-selected');

                      // update detail view
                      await axios.get("https://supporcallapi.azurewebsites.net/api/Contacts/" + e.id).then((c) => {
                        setCurrentContact(c.data);
                        setDetailLoading(false);
                      });
                    }}>
                      <th>{e.id}</th>
                      <td>{e.forename} {e.surname}</td>
                      <td>{e.email}</td>
                      <td>{e.orgId}</td>
                      <td>{e.role}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          :
          <div style={{width:"100%", textAlign:"center"}}>
            <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
            <h3><b>Loading contacts...</b></h3>
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
          : (currentContact && contactEditMode) || contactCreateMode ?
            // contact detail editing view
            <div style={{width:"100%"}}>
              <div class="level">
                <div class="level-left">
                  <h2 class="title is-4 level-item" style={{marginBottom:"0.4em"}}>{contactCreateMode ? <>Creating Contact</> : <>Editing Contact: {currentContact.id}</>}</h2>
                </div>
                {!contactCreateMode ?
                <div class="level-right">
                  <button class="button is-rounded is-dark level-item" onClick={(e) => {
                    e.preventDefault(); // prevent page reload
                    clearNewObject();
                    setContactEditMode(!contactEditMode);
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
                  <span>Organisation</span>
                </div>
                <div class="column">
                  {/* TODO: Change this into a dropdown once the API is available */}
                  <input class="input" type="text" value={newOrgId} onChange={(e) => {
                    setNewOrgId(e.target.value);
                  }} />
                </div>
              </div>
              <div style={{width:"100%", textAlign:"center"}}>
                { contactCreateMode ? 
                  <button class="button is-primary" onClick={async (e) => {
                    e.preventDefault();
                    setDetailLoading(true);
                    setContactCreateMode(false);
                    // TODO: Test this works in insomnia and then in the application itself
                    await axios.post("https://supporcallapi.azurewebsites.net/api/Contacts", {
                      forename: newForename,
                      surname: newSurname,
                      role: newRole,
                      email: newEmail,
                      phoneNumber: newPhoneNumber,
                      orgId: newOrgId
                    }).then(() => {
                      setDetailLoading(false);
                      refreshContactTable();
                      clearNewObject();
                      setCurrentContact();
                    });
                  }}>Create Contact</button>
                :
                  <button class="button is-primary" onClick={async (e) => {
                    e.preventDefault(); // prevent page reload
                    setDetailLoading(true);
                    setContactEditMode(false);
                    await axios.post("https://supporcallapi.azurewebsites.net/api/Contacts/update", {
                      id : currentContact.id,
                      forename: newForename,
                      surname: newSurname,
                      role: newRole,
                      email: newEmail,
                      phoneNumber: newPhoneNumber,
                      orgId: newOrgId
                    }).then((r) => setCurrentContact(r.data));
                    setDetailLoading(false);
                  }}>Update Contact</button>
                }
              </div>
            </div>
          : currentContact && !contactEditMode ?
            // contact detail viewing section
            <div style={{width:"100%"}}>
              <div class="level">
                <div class="level-left">
                  <h2 class="title is-4 level-item" style={{marginBottom:"0.4em"}}>Contact: {currentContact.id}</h2>
                </div>
                <div class="level-right">
                  <button class="button is-rounded is-light level-item" onClick={async (e) => refreshContactDetails(e)}>
                    <span class="icon"><FontAwesomeIcon icon={faSync} /></span>
                  </button>
                  <button class="button is-rounded is-light level-item" onClick={(e) => {
                    e.preventDefault(); // prevent page reload
                    setNewForename(currentContact.forename);
                    setNewSurname(currentContact.surname);
                    setNewRole(currentContact.role);
                    setNewEmail(currentContact.email);
                    setNewPhoneNumber(currentContact.phoneNumber);
                    setNewOrgId(currentContact.orgId);
                    setContactEditMode(!contactEditMode);
                  }}>
                    <span class="icon"><FontAwesomeIcon icon={faPencilAlt} /></span>
                  </button>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Forename</span>
                </div>
                <div class="column">
                  <label>{currentContact.forename ? currentContact.forename : "No forename set"}</label>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Surname</span>
                </div>
                <div class="column">
                  <label>{currentContact.surname ? currentContact.surname : "No surname set"}</label>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Role</span>
                </div>
                <div class="column">
                  <label>{currentContact.role ? currentContact.role : "No role set"}</label>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Email</span>
                </div>
                <div class="column">
                  <label>{currentContact.email ? currentContact.email : "No email set"}</label>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Phone Number</span>
                </div>
                <div class="column">
                  <label>{currentContact.phoneNumber ? currentContact.phoneNumber : "No phone number set"}</label>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Organisation</span>
                </div>
                <div class="column">
                  <label>{currentContact.orgId ? currentContact.orgId : "No associated organisation"}</label>
                </div>
              </div>
            </div>
          :
            <div style={{width:"100%"}}>
              <h2 class="title is-4">No contact selected</h2>
              <h3 class="subtitle is-6">Please select or create a contact from the table panel</h3>
            </div>
          }
        </div>
      </div>
    </div>
  );
}