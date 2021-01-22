import React, { useEffect, useState } from 'react';
import "../bstyles.scss";
import axios from "axios";

export const Contacts = () => {
  let [contactList, setContactList] = useState([]);
  let [currentContact, setCurrentContact] = useState();
  let contactEditMode = false;

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
                  // update table styling
                  if (currentContact && currentContact.id && currentContact.id !== e.id && currentContact.id.length > 0) {
                    document.getElementById(currentContact.id).classList.remove('is-selected');
                  }
                  document.getElementById(e.id).classList.add('is-selected');

                  // update detail view
                  await axios.get("https://supporcallapi.azurewebsites.net/api/Contacts/" + e.id).then((c) => setCurrentContact(c.data))
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
        </div>
      </div>
      <div class="column">
        <div class="box" style={{width:"100%"}}>
          {currentContact ?
            <div style={{width:"100%"}}>
              <button class="button" onClick={() => {contactEditMode = !contactEditMode; console.log(contactEditMode)}}>Edit?</button>
              <input class="input" type="text is-static" value={currentContact.forename} readOnly={contactEditMode} />
              <input class="input" type="text is-static" value={currentContact.surname} readOnly={contactEditMode} />
              <input class="input" type="text is-static" value={currentContact.role} readOnly={contactEditMode} />
              <input class="input" type="text is-static" value={currentContact.email} readOnly={contactEditMode} />
              <input class="input" type="text is-static" value={currentContact.phoneNumber} readOnly={contactEditMode} />
              <input class="input" type="text is-static" value={currentContact.orgId} readOnly={contactEditMode} />
            </div>
           : "None"}
        </div>
      </div>
    </div>
  );
}