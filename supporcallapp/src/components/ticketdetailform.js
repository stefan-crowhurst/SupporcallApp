import { useEffect, useState, useContext } from "react";
import moment from "moment";
import axios from "axios";
import BulmaTagsInput from '@creativebulma/bulma-tagsinput';
import { useParams, useRouteMatch, useHistory } from "react-router-dom";
import { Context } from '../store';

export const TicketDetailForm = (props) => {
  const { ticketid } = useParams();
  let [orgId, setOrgId] = useState("");
  let [contactId, setContactId] = useState("");
  let [agentId, setAgentId] = useState("");
  let [title, setTitle] = useState("");
  let [labels, setLabels] = useState("");
  let [priority, setPriority] = useState(1);
  let [complexity, setComplexity] = useState(1);
  let [status, setStatus] = useState("");
  let [lastUpdatedAt, setLastUpdatedAt] = useState("");
  let [slaMet, setSlaMet] = useState("");

  let [orgSummary, setOrgSummary] = useState([]);
  let [contactSummary, setContactSummary] = useState([]);
  let [agentSummary, setAgentSummary] = useState([]);
  let match = useRouteMatch();
  const history = useHistory();
  let [isLoading, setIsLoading] = useState(false);
  
  const [store] = useContext(Context);

  useEffect(() => {
    clearObjects();
    updateSummaries();
    if (props.mode === "edit") {
      setIsLoading(true);
      refreshDetails().then(() => {
        setIsLoading(false);
        var inputTags = document.getElementById('labelstags');
        var tagAccessor = new BulmaTagsInput(inputTags);
        tagAccessor.on("after.add", (data) => {
          setLabels(tagAccessor.value);
        });
        tagAccessor.on("after.remove", (data) => {
          setLabels(tagAccessor.value);
        });
        tagAccessor.add(labels);
      });
    } else {
      var inputTags = document.getElementById('labelstags');
      var tagAccessor = new BulmaTagsInput(inputTags);
      tagAccessor.on("after.add", (data) => {
        setLabels(tagAccessor.value);
      });
      tagAccessor.on("after.remove", (data) => {
        setLabels(tagAccessor.value);
      });
    }
  }, [props.mode]);

  function clearObjects() {
    setOrgId("");
    setContactId("");
    setAgentId("");
    setTitle("");
    setLabels("");
    setPriority(1);
    setComplexity(1);
    setStatus("");
    setOrgSummary([]);
  }

  async function updateSummaries() {
    await axios.get("https://supporcallapi.azurewebsites.net/api/Organisations/summaries").then((r) => {
      setOrgSummary(r.data);
    });
    await axios.get("https://supporcallapi.azurewebsites.net/api/Contacts/summaries").then((r) => {
      setContactSummary(r.data);
    });
    await axios.get("https://supporcallapi.azurewebsites.net/api/Agents/summaries").then((r) => {
      setAgentSummary(r.data);
    });
  }

  async function refreshDetails() {
    await axios.get("https://supporcallapi.azurewebsites.net/api/Tickets/" + ticketid).then((r) => {
      setOrgId(r.data.orgId);
      setContactId(r.data.contactId);
      setAgentId(r.data.agentId);
      setTitle(r.data.title);
      setLabels(r.data.labels);
      setPriority(r.data.priority);
      setComplexity(r.data.complexity);
      setStatus(r.data.status);
      setLastUpdatedAt(r.data.lastUpdatedAt);
      setSlaMet(r.data.slaMet);
    });
  }

  return(
    <>
      <h2 class="title is-4">{props.mode === "create" ? <>Creating Ticket </> : props.mode === "edit" ? <>Editing Ticket {ticketid}</> : <>Erroneous Path</>}</h2>
      {props.mode === "edit" && !isLoading ? <h2 class="subtitle is-6">Ticket last updated at: {moment(lastUpdatedAt).format("HH:mm DD/MM/YY")}</h2> : null}
      {isLoading ? 
        <div style={{width:"100%", textAlign:"center"}}>
          <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
          <h3><b>Loading agents...</b></h3>
        </div>
      : props.mode === "create" || (props.mode === "edit" && ticketid !== null && ticketid !== "") ?
      <>
        <div class="columns">
          <div class="column is-2">
            <span>Title</span>
          </div>
          <div class="column">
            <input class="input" type="text" value={title} onChange={(e) => {
              setTitle(e.target.value);
            }} />
          </div>
        </div>
        <div class="columns">
          <div class="column is-2">
            <span>Status</span>
          </div>
          <div class="column">
            <div class="select" style={{width:"100%"}}>
              <select style={{width:"100%"}} defaultValue="Open" value={status} onChange={(e) => {
                setStatus(e.target.value);
              }}>
                <option value="Open">Open</option>
                <option value="In Need Of Action">In Need Of Action</option>
                <option value="Actioned">Actioned</option>
                <option value="Solved">Solved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-2">
            <span>Organisation</span>
          </div>
          <div class="column">
            <div class="select" style={{width:"100%"}}>
              <select style={{width:"100%"}} defaultValue="" value={orgId} onChange={(e) => {
                setOrgId(e.target.value);
              }}>
                <option value="" style={{display:"none"}} disabled>Select Organisation</option>
                {orgSummary.map((i) => 
                  <option value={i.id}>{i.name}</option>
                )}
              </select>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-2">
            <span>Contact</span>
          </div>
          <div class="column">
            <div class="select" style={{width:"100%"}}>
              <select style={{width:"100%"}} defaultValue="" value={contactId} onChange={(e) => {
                setContactId(e.target.value);
              }}>
                <option value="" style={{display:"none"}} disabled>Select Contact</option>
                {contactSummary.map((i) => 
                  <option value={i.id}>{i.name}</option>
                )}
              </select>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-2">
            <span>Agent</span>
          </div>
          <div class="column">
            <div class="select" style={{width:"100%"}}>
              <select style={{width:"100%"}} defaultValue="" value={agentId} onChange={(e) => {
                setAgentId(e.target.value);
              }}>
                <option value="" style={{display:"none"}} disabled>Select Agent</option>
                {agentSummary.map((i) => 
                  <option value={i.id}>{i.name}</option>
                )}
              </select>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-2">
            <span>Priority</span>
          </div>
          <div class="column">
            <div class="columns" style={{width:"100%"}}>
              <b class="column is-1" style={{textAlign:"center"}}>{priority}</b>
              <span class="column is-1" style={{textAlign:"center"}}>Low</span>
              <input class="column slider" step="1" min="1" max="4" type="range" value={priority} onChange={(e) => {
                setPriority(e.target.value);
              }} />
              <span class="column is-1" style={{textAlign:"center"}}>High</span>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-2">
            <span>Complexity</span>
          </div>
          <div class="column">
            <div class="columns" style={{width:"100%"}}>
              <b class="column is-1" style={{textAlign:"center"}}>{complexity}</b>
              <span class="column is-1" style={{textAlign:"center"}}>Low</span>
              <input class="column slider" step="1" min="1" max="4" type="range" value={complexity} onChange={(e) => {
                setComplexity(e.target.value);
              }} />
              <span class="column is-1" style={{textAlign:"center"}}>High</span>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-2">
            <span>Labels</span>
          </div>
          <div class="column">
            <input id="labelstags" class="input" type="tags" placeholder="Enter label followed by comma" value={labels} />
          </div>
        </div>
        {props.mode === "edit" ?
          <div class="columns">
            <div class="column is-2">
              <span><abbr title="If agreed with client">SLA Met?</abbr></span>
            </div>
            <div class="column">
              <div class="checkbox">
                <input type="checkbox" checked={slaMet} onChange={(e) => {
                  setSlaMet(e.target.checked);
                }} />
              </div>
            </div>
          </div>
        : props.mode === "create" ?
          <div class="columns">
            <div class="column is-2">
              <span><abbr title="Is there an SLA agreement with the client?">SLA Agreed?</abbr></span>
            </div>
            <div class="column">
              <div class="checkbox">
              <input type="checkbox" checked={slaMet} onChange={(e) => {
                setSlaMet(e.target.checked);
              }} />
              </div>
            </div>
          </div>
        : null}
        <div style={{width:"100%", textAlign:"center"}}>
          {props.mode === "create" ? 
            <button class="button is-primary" style={{margin:"0.4em"}} onClick={async (e) => {
              e.preventDefault();
              await axios.post("https://supporcallapi.azurewebsites.net/api/Tickets", {
                title: title,
                status: status,
                orgId: orgId,
                contactId: contactId,
                agentId: agentId,
                priority: priority,
                complexity: complexity,
                labels: labels,
                slaMet: slaMet ? 0 : null,
                requesterId: store.loggedInAgentId
              }).then((r) => {
                clearObjects();
                history.push(match.url.replace("create", r.data.id));
              });
            }}>Create Ticket</button>
          : props.mode === "edit" ?
          <button class="button is-primary" style={{margin:"0.4em"}} onClick={async (e) => {
            e.preventDefault();
            await axios.post("https://supporcallapi.azurewebsites.net/api/Tickets/update", {
              id: ticketid,
              title: title,
              status: status,
              orgId: orgId,
              contactId: contactId,
              agentId: agentId,
              priority: priority,
              complexity: complexity,
              labels: labels,
              slaMet: slaMet ? 1 : 0,
              requesterId: store.loggedInAgentId
            }).then(() => {
              clearObjects();
              history.push(match.url.replace("/edit", ""));
            });
          }}>Update Ticket</button>
          : null}
          <button class="button is-warning" style={{margin:"0.4em"}} onClick={async (e) => {
            e.preventDefault();
            clearObjects();
          }}>Clear Fields</button>
        </div>
      </> : <span>Erroneous URL entered, please use the navigation bar to return to a valid page</span>}
    </>
  );
}