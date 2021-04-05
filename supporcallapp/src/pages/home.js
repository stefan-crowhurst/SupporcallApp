import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useRouteMatch, useHistory } from "react-router-dom";
import "../bstyles.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faCheck, faTimes, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import moment from "moment";
import { Context } from "../store";
import { Pie } from "react-chartjs-2";

/**
 * Home dashboard page, comprised of 4 tiles:
 * 1 - Recently Updated Tickets
 * 2 - Assigned Tickets
 * 3 - Ticket Status Reports
 * 4 - Contact Speeddial
 * 
 * @returns Tiled dashboard page
 */
export const Home = () => {
  let [recentTickets, setRecentTickets] = useState([]);
  let [assignedTickets, setAssignedTickets] = useState([]);
  let [contacts, setContacts] = useState([]);
  var [stats, setStats] = useState(null);
  let [isLoading, setIsLoading] = useState(true);
  let [store, dispatch] = useContext(Context);
  let match = useRouteMatch();
  const history = useHistory();
  var graphWidth = 100;
  var graphHeight = 150;

  useEffect(() => {
    refreshData().then(() => setIsLoading(false));
  }, []);

  async function refreshData() {
    setIsLoading(true);
    setRecentTickets([]);
    setAssignedTickets([]);
    await axios.get("https://supporcallapi.azurewebsites.net/api/Tickets/recent").then((r) => {
      setRecentTickets(r.data);
    });
    await axios.get("https://supporcallapi.azurewebsites.net/api/Tickets/assigned/" + store.loggedInAgentId).then((r) => {
      setAssignedTickets(r.data);
    });
    await axios.get("https://supporcallapi.azurewebsites.net/api/Stats/true").then((r) => {
      setStats(r.data);
    });
    await axios.get("https://supporcallapi.azurewebsites.net/api/Contacts/contacttile").then((r) => {
      setContacts(r.data);
    });
  }

  return (
    <div class="box" style={{width:"100%"}}>
      <div class="level">
        {/* Title and refresh */}
        <div class="level-left">
          <h2 class="title is-3 level-item">Dashboard</h2>
        </div>
        <div class="level-right">
          <button class="button is-rounded is-light level-item" onClick={async (e) => {
            e.preventDefault(); // prevent page reload
            refreshData().then(() => setIsLoading(false));
          }}>
            <span class="icon"><FontAwesomeIcon icon={faSync} /></span>
          </button>
        </div>
      </div>
      <div class="tile is-ancestor">
        {/* Parent tile */}
        <div class="tile is-parent is-vertical">
          {/* Left-hand tiles */}
          <div class="box tile is-12">
            {/* Recent tickets tile */}
            <div class="content" style={{width:"100%"}}>
              <div class="level">
                <div class="level-left">
                  <div>
                    <h2 class="title is-4">Recently Updated Tickets:</h2>
                    <p class="subtitle is-6">Most recently updated tickets listed here</p>
                  </div>
                </div>
                <div class="level-right">
                  <button class="button is-primary is-inverted" onClick={() => history.push(`${match.url.replace("home", "")}tickets`)}>
                    <span>View all tickets</span>
                    <span class="icon"><FontAwesomeIcon icon={faArrowRight} /></span>
                  </button>
                </div>
              </div>
              {isLoading ?
                // Show loading bar
                <div style={{width:"100%", textAlign:"center"}}>
                  <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
                  <h3 style={{fontSize:"1em"}}><b>Loading recently updated tickets...</b></h3> {/* Not sure why the font increased .5 em here without styling? */}
                </div>
              : !isLoading && recentTickets.length === 0 ?
                // Show no tickets message
                <div class="notification is-warning"><b>No tickets to display</b></div>
              :
                // Show table with cherry-picker attributes
                <table class="table is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th><abbr title="Ticket ID">ID</abbr></th>
                      <th>Title</th>
                      <th>Contact</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Agent</th>
                      <th><abbr title="Time last updated">Updated</abbr></th>
                      <th><abbr title="Service Level Agreement met?">SLA?</abbr></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTickets.map((e) =>
                      <tr id={e.id} style={{cursor:"pointer"}} onClick={() => history.push(`${match.url.replace("home", "")}tickets/${e.id}`)}>
                        <th>{e.id}</th>
                        <td>{e.title ? e.title : "-"}</td>
                        <td>{e.contactId ? e.contactId : "-"}</td>
                        <td>{e.priority ? e.priority : "-"}</td>
                        <td>{e.status ? e.status : "-"}</td>
                        <td>{e.agentId ? e.agentId : "-"}</td>
                        <td><b>{moment(e.lastUpdatedAt).format("HH:mm DD/MM/YY")}</b></td>
                        <td><FontAwesomeIcon icon={e.slaMet && e.slaMet === 1 ? faCheck : faTimes} /></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              }
            </div>
          </div>
          <div class="box tile is-12">
            {/* Ticket status tile */}
            <div class="content" style={{width:"100%"}}>
              <div class="level">
                <div class="level-left">
                  <div>
                    <h2 class="title is-4">Ticket Overview:</h2>
                    <p class="subtitle is-6">Ratio of current ticket statuses</p>
                  </div>
                </div>
                <div class="level-right">
                  <button class="button is-primary is-inverted" onClick={() => history.push(`${match.url.replace("home", "")}reports`)}>
                    <span>View all reports</span>
                    <span class="icon"><FontAwesomeIcon icon={faArrowRight} /></span>
                  </button>
                </div>
              </div>
              {isLoading ?
                // Show loading bar
                <div style={{width:"100%", textAlign:"center"}}>
                  <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
                  <h3 style={{fontSize:"1em"}}><b>Loading report...</b></h3> {/* Not sure why the font increased .5 em here without styling? */}
                </div>
              :
                // This is a bad way of checking if the values are all 0, but it was the only way I could get it to work
                stats && (stats.statuses["Open"] !== 0 || stats.statuses["In Need Of Action"] !== 0 || stats.statuses["Actioned"] !== 0 || stats.statuses["Solved"] !== 0) ?
                  // Generate and show pie chart
                  <Pie
                    data={{
                      labels: stats ? Object.keys(stats.statuses) : [],
                      datasets: [{
                        data: stats ? Object.values(stats.statuses) : [],
                        backgroundColor: ['#D90000', "#ffe08a", "#09a2e3", "#48c78e"],
                      }]
                    }}
                    width={graphWidth}
                    height={graphHeight}
                    options={{
                      maintainAspectRatio: false
                    }}
                  />
                :
                  // Show no data
                  <div class="notification is-warning"><b>No ticket status data found</b></div>
              }
            </div>
          </div>
        </div>
        <div class="tile is-parent is-vertical">
          {/* Right hand tiles */}
          <div class="box tile is-12">
            {/* Assigned tickets tile */}
            <div class="content" style={{width:"100%"}}>
              <div class="level">
                <div class="level-left">
                  <div>
                    <h2 class="title is-4">Your Assigned Tickets:</h2>
                    <p class="subtitle is-6">Tickets assigned for you to look at</p>
                  </div>
                </div>
                <div class="level-right">
                  <button class="button is-primary is-inverted" onClick={() => history.push(`${match.url.replace("home", "")}tickets`)}>
                    <span>View all tickets</span>
                    <span class="icon"><FontAwesomeIcon icon={faArrowRight} /></span>
                  </button>
                </div>
              </div>
              {isLoading ?
                // Show loaading bar
                <div style={{width:"100%", textAlign:"center"}}>
                  <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
                  <h3 style={{fontSize:"1em"}}><b>Loading assigned tickets...</b></h3> {/* Not sure why the font increased .5 em here without styling? */}
                </div>
              : !isLoading && assignedTickets.length === 0 ?
                // Show no tickets message
                <div class="notification is-warning"><b>No tickets assigned, pick up some free tickets or seek advice from your manager</b></div>
              :
                // Show ticket table with cherry-picked attributes
                <table class="table is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th><abbr title="Ticket ID">ID</abbr></th>
                      <th>Title</th>
                      <th>Contact</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th><abbr title="Time last updated">Updated</abbr></th>
                      <th><abbr title="Service Level Agreement met?">SLA?</abbr></th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedTickets.map((e) =>
                      <tr id={e.id} style={{cursor:"pointer"}} onClick={() => history.push(`${match.url.replace("home", "")}tickets/${e.id}`)}>
                        <th>{e.id}</th>
                        <td>{e.title ? e.title : "-"}</td>
                        <td>{e.contactId ? e.contactId : "-"}</td>
                        <td>{e.priority ? e.priority : "-"}</td>
                        <td>{e.status ? e.status : "-"}</td>
                        <td><b>{moment(e.lastUpdatedAt).format("HH:mm DD/MM/YY")}</b></td>
                        <td><FontAwesomeIcon icon={e.slaMet && e.slaMet === 1 ? faCheck : faTimes} /></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              }
            </div>
          </div>
          <div class="box tile is-12">
            {/* Contact speeddial tile */}
            <div class="content" style={{width:"100%"}}>
              <div class="level">
                <div class="level-left">
                  <div>
                    <h2 class="title is-4">Contacts:</h2>
                    <p class="subtitle is-6">Click a contact to dial</p>
                  </div>
                </div>
                <div class="level-right">
                  <button class="button is-primary is-inverted" onClick={() => history.push(`${match.url.replace("home", "")}contacts`)}>
                    <span>View all contacts</span>
                    <span class="icon"><FontAwesomeIcon icon={faArrowRight} /></span>
                  </button>
                </div>
              </div>
              {isLoading ?
                // Show loading bar
                <div style={{width:"100%", textAlign:"center"}}>
                  <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
                  <h3 style={{fontSize:"1em"}}><b>Loading contacts...</b></h3> {/* Not sure why the font increased .5 em here without styling? */}
                </div>
              : !isLoading && contacts.length === 0 ?
                // Show no contacts message
                <div class="notification is-warning"><b>No contacts to display</b></div>
              :
                // Show contact table with cherry-picked attributes
                <table class="table is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th><abbr title="Contact ID">ID</abbr></th>
                      <th>Name</th>
                      <th>Email</th>
                      <th><abbr title="Phone Number">Phone #</abbr></th>
                      <th><abbr title="Organisation ID">Org. Id</abbr></th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c) =>
                      <tr id={c.id} style={{cursor:"pointer"}} onClick={() => {
                        // Update phone number and trigger dialler display
                        dispatch({type: "UPDATE_NUMBER", payload: {numToCall: c.phoneNumber}});
                        document.getElementById("dialler-modal").classList.add("is-active");
                      }}>
                        <th>{c.id}</th>
                        <td>{c.forename ? c.forename : "-"} {c.surname ? c.surname : "-"}</td>
                        <td>{c.email ? c.email : "-"}</td>
                        <td>{c.phoneNumber ? c.phoneNumber : "-"}</td>
                        <td>{c.orgId ? c.orgId : "-"}</td>
                        <td>{c.role ? c.role : "-"}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}