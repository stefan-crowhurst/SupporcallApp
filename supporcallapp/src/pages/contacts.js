import React, { useEffect, useState } from 'react';
import "../bstyles.scss";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

export const Contacts = () => {
  let [contactList, setContactList] = useState([]);
  let [currentContact, setCurrentContact] = useState();
  let [detailLoading, setDetailLoading] = useState(false);
  let [contactEditMode, setContactEditMode] = useState(false);

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
                  <button class="button is-primary level-item">
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
                      console.log("loading set");

                      // update table styling
                      if (currentContact && currentContact.id && currentContact.id !== e.id && currentContact.id.length > 0) {
                        document.getElementById(currentContact.id).classList.remove('is-selected');
                      }
                      document.getElementById(e.id).classList.add('is-selected');

                      // update detail view
                      await axios.get("https://supporcallapi.azurewebsites.net/api/Contacts/" + e.id).then((c) => {
                        setCurrentContact(c.data);
                        setDetailLoading(false);
                        console.log("loading unset");
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
          : currentContact && contactEditMode ?
            // contact detail editing view
            <form style={{width:"100%"}}>
              <div class="level">
                <div class="level-left">
                  <h2 class="title is-4 level-item" style={{marginBottom:"0.4em"}}>Contact: {currentContact.id}</h2>
                </div>
                <div class="level-right">
                  <button class="button is-rounded is-light level-item" onClick={(e) => {
                    e.preventDefault();
                    setContactEditMode(!contactEditMode);
                  }}>
                    <span class="icon"><FontAwesomeIcon icon={faPencilAlt} /></span>
                  </button>
                </div>
              </div>
              <div class="field is-horizontal" style={{width:"100%"}}>
                <div class="field-label is-normal">
                  <label class="label">Forename</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input is-static" type="text" value={currentContact.forename} readonly />
                    </p>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Surname</span>
                </div>
                <div class="column">
                  <input class="input" type="text is-static" value={currentContact.surname} readOnly={contactEditMode} />
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Role</span>
                </div>
                <div class="column">
                  <input class="input" type="text is-static" value={currentContact.role} readOnly={contactEditMode} />
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Email</span>
                </div>
                <div class="column">
                  <input class="input" type="text is-static" value={currentContact.email} readOnly={contactEditMode} />
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Phone Number</span>
                </div>
                <div class="column">
                  <input class="input" type="text is-static" value={currentContact.phoneNumber} readOnly={contactEditMode} />
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter">
                  <span>Organisation</span>
                </div>
                <div class="column">
                  {/* TODO: Change this into a dropdown once the API is available */}
                  <input class="input" type="text is-static" value={currentContact.orgId} readOnly={contactEditMode} />
                </div>
              </div>
            </form>
          : currentContact && !contactEditMode ?
            // contact detail viewing section
            <div style={{width:"100%"}}>
              <div class="level">
                <div class="level-left">
                  <h2 class="title is-4 level-item" style={{marginBottom:"0.4em"}}>Contact: {currentContact.id}</h2>
                </div>
                <div class="level-right">
                  <button class="button is-rounded is-light level-item" onClick={(e) => {
                    e.preventDefault();
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