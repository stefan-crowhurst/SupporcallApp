import { useParams, useRouteMatch, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faPencilAlt, faSync } from '@fortawesome/free-solid-svg-icons';

export const TicketDetailsView = () => {
  const { ticketid } = useParams();
  let [ticket, setTicket] = useState();
  let [detailLoading, setDetailLoading] = useState(true);
  let match = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    refreshTicketDetails();
  },[]);
  
  async function refreshTicketDetails() {
    setDetailLoading(true);
    await axios.get("https://supporcallapi.azurewebsites.net/api/Tickets/details/" + ticketid).then((t) => {
      setTicket(t.data);
      setDetailLoading(false);
    });
  }

  return (
    <div class="box">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <div class="tile is-parent is-vertical">
              <div class="tile is-12">
                <h2 class="title is-4">Ticket Details:</h2>
              </div>
              <div class="tile is-12">
                <div class="subtitle is-6">
                  {detailLoading ? <>Loading...</> :
                    <>Ticket last updated: {moment(ticket.lastUpdatedAt).format("HH:mm DD/MM/YY")}</>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="level-right">
          <button class="button is-rounded is-light level-item" onClick={(e) => {
            e.preventDefault();
            refreshTicketDetails();
          }}>
            <span class="icon"><FontAwesomeIcon icon={faSync} /></span>
          </button>
          <button class="button is-rounded is-light level-item" onClick={(e) => {
            e.preventDefault();
            history.push(match.url.replace(`${ticketid}`, `edit/${ticketid}`));
          }}>
            <span class="icon"><FontAwesomeIcon icon={faPencilAlt} /></span>
          </button>
        </div>
      </div>
      {detailLoading ?
      <div style={{width:"100%", textAlign:"center"}}>
        <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
        <h3><b>Loading ticket details...</b></h3>
      </div>
      :
      <>
        <div class="columns">
          <div class="column is-4">
            <b>Title</b>
          </div>
          <div class="column">
            <span>{ticket.title ? <>{ticket.title}</> : <>No title found</>}</span>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4">
            <b>Status</b>
          </div>
          <div class="column">
            <span>{ticket.status ? <>{ticket.status}</> : <>No status found</>}</span>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4">
            <b>Report Date</b>
          </div>
          <div class="column">
            <span>{moment(ticket.reportDate).format("HH:mm DD/MM/YY")}</span>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4">
            <b>Organisation</b>
          </div>
          <div class="column">
            <span>{ticket.orgId ? <>{ticket.orgId}</> : <>No organisation found</>}</span>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4">
            <b>Contact</b>
          </div>
          <div class="column">
            <span>{ticket.contactId ? <>{ticket.contactId}</> : <>No contact found</>}</span>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4">
            <b>Agent</b>
          </div>
          <div class="column">
            <span>{ticket.agentId ? <>{ticket.agentId}</> : <>No agent found</>}</span>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4">
            <b>Priority</b>
          </div>
          <div class="column">
            <span>{ticket.priority ? <>{ticket.priority}</> : <>No priority rating found</>}</span>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4">
            <b>Complexity</b>
          </div>
          <div class="column">
            <span>{ticket.complexity ? <>{ticket.complexity}</> : <>No complexity rating found</>}</span>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4">
            <b>Labels</b>
          </div>
          <div class="column">
            {/* TODO: Need to split this by commas and then render each as a tag */}
            <span>{ticket.labels ?
            <>
              {ticket.labels.split(",").map((s) => {
                return(<span class="tag is-primary" style={{marginRight:"0.4em"}}>{s}</span>)
              })}
            </>
            :
            <>No labels found</>}</span>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4">
            <b>SLA Met <abbr title="Only applicable if SLA has been agreed with Organisation/Client">(if agreed)</abbr></b>
          </div>
          <div class="column">
            <span>{ticket.slaMet !== null ? <FontAwesomeIcon icon={ticket.slaMet === 1 ? faCheck : faTimes} /> : <>No SLA details found</>}</span>
          </div>
        </div>
      </>}
    </div>
  );
}