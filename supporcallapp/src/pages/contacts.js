import React from 'react';
import { Link } from "react-router-dom";
import "../bstyles.scss";

export const Contacts = () => {
  let currentClass = "";

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
                <th>Organisation</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr id="C-1" style={{cursor:"pointer"}} onClick={() => {
                const thisId = "C-1";
                console.log("Yep, clicked");
                if (currentClass != thisId && currentClass && currentClass.length > 0) {
                  document.getElementById(currentClass).classList.remove('is-selected');
                }
                document.getElementById(thisId).classList.add('is-selected');
                currentClass = thisId;
                console.log(currentClass);
              }}>
                <th>C-1</th>
                <td>Fname Sname</td>
                <td>email@example.com</td>
                <td>Company</td>
                <td>Role</td>
              </tr>
              <tr id="C-2" style={{cursor:"pointer"}} onClick={() => {
                const thisId = "C-2";
                console.log("Yep, clicked");
                if (currentClass != thisId && currentClass && currentClass.length > 0) {
                  document.getElementById(currentClass).classList.remove('is-selected');
                }
                document.getElementById(thisId).classList.add('is-selected');
                currentClass = thisId;
                console.log(currentClass);
              }}>
                <th>C-2</th>
                <td>Fname Sname</td>
                <td>email@example.com</td>
                <td>Company</td>
                <td>Role</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="column">
        <div class="box" style={{width:"100%"}}>
          <p>detail content here</p>
          <p>current class is {currentClass}</p>
        </div>
      </div>
    </div>
  );
}