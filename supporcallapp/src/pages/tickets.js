import React, { useEffect, useState } from 'react';
import "../bstyles.scss";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faSync, faTimes } from '@fortawesome/free-solid-svg-icons';

export const Tickets = () => {
  let [ticketList, setTicketList] = useState([]);
  let [currentTicket, setCurrentTicket] = useState();
  let [ticketEditMode, setTicketEditMode] = useState(false);
  let [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    refreshTicketTable();
  }, []);

  async function refreshTicketTable() {
    setTicketList([]); // this triggers the loading UI
    setIsLoading(true);
    await axios.get("https://supporcallapi.azurewebsites.net/api/Tickets").then((i) => {
      setTicketList(i.data);
    }).then(() => {
      if (currentTicket && currentTicket.id.length > 0) {
        document.getElementById(currentTicket.id).classList.add('is-selected');
      }
      setIsLoading(false);
    });
  }

  return (
    <div style={{width:"100%"}}>
      <div class="table-container box" style={{width:"100%"}}>
        {ticketList && ticketList.length > 0 ?
          <>
            <div class="level">
              <div class="level-left">
                <h2 class="title is-4 level-item" style={{marginBottom:"0.4em"}}>All Tickets</h2>
              </div>
              <div class="level-right">
                <button class="button is-rounded is-light level-item" onClick={async (e) => {
                  e.preventDefault(); // prevent page reload
                  refreshTicketTable();
                }}>
                  <span class="icon"><FontAwesomeIcon icon={faSync} /></span>
                </button>
                <button class="button is-primary level-item" onClick={(e) => {
                  e.preventDefault();
                  // update table styling
                  if (currentTicket && currentTicket.id && currentTicket.id !== e.id && currentTicket.id.length > 0) {
                    document.getElementById(currentTicket.id).classList.remove('is-selected');
                    if (ticketEditMode) {
                      setTicketEditMode();
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
                  <th><abbr title="Ticket ID">ID</abbr></th>
                  <th>Title</th>
                  <th>Contact</th>
                  <th>Organisation</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Agent</th>
                  <th><abbr title="Time last updated">Updated</abbr></th>
                  <th><abbr title="SLA Met?">SLA?</abbr></th>
                </tr>
              </thead>
              <tbody>
                {ticketList.map((e) =>
                  <tr id={e.id} style={{cursor:"pointer"}} onClick={async () => {
                    // disable editing & creating modes to prevent data persisting between selections
                    setTicketEditMode(false);

                    // update table styling
                    if (currentTicket && currentTicket.id && currentTicket.id !== e.id && currentTicket.id.length > 0) {
                      document.getElementById(currentTicket.id).classList.remove('is-selected');
                    }
                    document.getElementById(e.id).classList.add('is-selected');

                    // update detail view
                    await axios.get("https://supporcallapi.azurewebsites.net/api/Tickets/" + e.id).then((c) => {
                      setCurrentTicket(c.data);
                    });
                  }}>
                    <th>{e.id}</th>
                    <td>{e.title}</td>
                    <td>{e.contactId}</td>
                    <td>{e.orgId}</td>
                    <td>{e.priority}</td>
                    <td>{e.status}</td>
                    <td>{e.agentId}</td>
                    <td>{moment(e.lastUpdated).format("HH:mm DD/MM/YY")}</td>
                    <td><FontAwesomeIcon icon={e.slaMet ? faCheck : faTimes} /></td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        : isLoading ?
        <div style={{width:"100%", textAlign:"center"}}>
          <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
          <h3><b>Loading tickets...</b></h3>
        </div>
        : !isLoading && ticketList.length == 0 ?
        <div style={{width:"100%"}}>
          <div class="level">
            <div class="level-left">
              <h2 class="title is-4 level-item" style={{marginBottom:"0.4em"}}>All Tickets</h2>
            </div>
            <div class="level-right">
              <button class="button is-rounded is-light level-item" onClick={async (e) => {
                e.preventDefault(); // prevent page reload
                refreshTicketTable();
              }}>
                <span class="icon"><FontAwesomeIcon icon={faSync} /></span>
              </button>
              <button class="button is-primary level-item" onClick={(e) => {
                e.preventDefault();
                alert("Ticket creation not implemented");
              }}>
                <span class="icon"><FontAwesomeIcon icon={faPlus} /></span>
                <span>Create</span>
              </button>
            </div>
          </div>
          <div class="notification is-warning"><b>No tickets to display, please create a ticket to continue</b></div>
        </div>
        :
        <div style={{width:"100%", textAlign:"center"}}>
          <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
          <h3><b>Attempting to load tickets</b></h3>
          <h3><b>An error may have occurred, please refresh the page or contact an administrator</b></h3>
        </div>}
      </div>
    </div>
  );
}