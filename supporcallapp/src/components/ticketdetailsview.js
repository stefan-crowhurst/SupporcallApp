import { useParams, useRouteMatch, useHistory } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faPencilAlt, faSync } from '@fortawesome/free-solid-svg-icons';
import { CallButton } from "./callbutton";
import { Context } from '../store';

export const TicketDetailsView = () => {
  const { ticketid } = useParams();
  let [ticket, setTicket] = useState();
  let [detailLoading, setDetailLoading] = useState(true);
  let [contactNumber, setContactNumber] = useState("");
  let [contactName, setContactName] = useState("");
  let match = useRouteMatch();
  const history = useHistory();
  const [store] = useContext(Context);

  useEffect(() => {
    refreshTicketDetails();
  },[]);
  
  async function refreshTicketDetails() {
    setDetailLoading(true);
    await axios.get("https://supporcallapi.azurewebsites.net/api/Tickets/details/" + ticketid).then(async (t) => {
      setTicket(t.data);
      setDetailLoading(false);
      await axios.get("https://supporcallapi.azurewebsites.net/api/Tickets/contactnumber/" + t.data.contactId).then((r) => {
        setContactNumber(r.data.phoneNumber);
        setContactName(r.data.name);
      });
    });
  }

  return (
    <div class="box">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <div class="tile is-parent is-vertical" style={{padding:0}}>
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
          <div class="column is-4" style={{display:"flex", alignItems:"center"}}>
            <b>Contact</b>
          </div>
          <div class="column" style={{display:"flex", alignItems:"center"}}>
            <span>{ticket.contactId ? <span style={{paddingRight:"0.7em"}}>{contactName ? contactName : ticket.contactId}</span> : <>No contact found</>}</span>
            {ticket.contactId && contactNumber ? <CallButton number={contactNumber} /> : null}
          </div>
        </div>
        <div class="columns">
          <div class="column is-4" style={{display:"flex", alignItems:"center"}}>
            <b>Agent</b>
          </div>
          <div class="column">
            <span>
              {ticket.agentId ?
                <>{ticket.agentId}</>
              :
                <div style={{display:"flex", alignItems:"center"}}>
                  <>No agent found</>
                  <button class="button is-primary" style={{margin:"0.4em"}} onClick={async (e) => {
                    e.preventDefault();
                    setDetailLoading(true);
                    await axios.post("https://supporcallapi.azurewebsites.net/api/Tickets/update", {
                      id: ticketid,
                      title: ticket.title,
                      status: ticket.status,
                      orgId: ticket.orgId,
                      contactId: ticket.contactId,
                      agentId: store.loggedInAgentId,
                      priority: ticket.priority,
                      complexity: ticket.complexity,
                      labels: ticket.labels,
                      slaMet: ticket.slaMet ? 1 : 0,
                      requesterId: store.loggedInAgentId
                    }).then(() => {
                      refreshTicketDetails();
                    });
                  }}>Assign to me</button>
                </div>
              }
            </span>
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
            <b>SLA Met <abbr title="Only applicable if service level agreement with Organisation/Client">(if agreed)</abbr></b>
          </div>
          <div class="column">
            <span>{ticket.slaMet !== null ? <FontAwesomeIcon icon={ticket.slaMet === 1 ? faCheck : faTimes} /> : <>No SLA details found</>}</span>
          </div>
        </div>
      </>}
    </div>
  );
}