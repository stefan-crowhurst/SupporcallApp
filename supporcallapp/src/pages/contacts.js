import React, { useState } from 'react';
import "../bstyles.scss";
import axios from "axios";

let tmpCntctLst = [];
axios.get("https://supporcallapi.azurewebsites.net/api/Contacts").then((i) => {
  tmpCntctLst = i.data;
});

export const Contacts = () => {
  let currentClass = "";
  let [contactList, setContactList] = useState(tmpCntctLst);
  console.log(contactList);

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
                <tr id={e.id} style={{cursor:"pointer"}} onClick={() => {
                  // update table styling
                  if (currentClass !== e.id && currentClass && currentClass.length > 0) {
                    document.getElementById(currentClass).classList.remove('is-selected');
                  }
                  document.getElementById(e.id).classList.add('is-selected');
                  currentClass = e.id;

                  // update detail view
                  // TODO
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
          <p>detail content here</p>
          <button class="button" onClick={async () => {
            await axios.get("https://supporcallapi.azurewebsites.net/api/Contacts").then((i) => console.log(i));
          }}>Test contact list</button>
          <button class="button" onClick={async () => {
            await axios.get("https://supporcallapi.azurewebsites.net/api/Contacts/C1").then((i) => console.log(i));
          }}>Test contact C1</button>
        </div>
      </div>
    </div>
  );
}