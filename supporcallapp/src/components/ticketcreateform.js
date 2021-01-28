import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";

export const TicketCreateForm = () => {
  let [orgId, setOrgId] = useState("");
  let [contactId, setContactId] = useState("");
  let [agentId, setAgentId] = useState("");
  let [title, setTitle] = useState("");
  let [labels, setLabels] = useState("");
  let [priority, setPriority] = useState("");
  let [complexity, setComplexity] = useState("");
  let [status, setStatus] = useState("");
  // sla met will not be included since an SLA can't be met before creation
  // lastUpdatedAt is not included as this is handled by API automation (in this case it will be set to reportDate)
  let [orgSummary, setOrgSummary] = useState([]);

  useEffect(() => {
    clearObject();
    axios.get("https://supporcallapi.azurewebsites.net/api/Organisations/summaries").then((r) => {
      setOrgSummary(r.data);
    });
  }, []);

  function clearObject() {
    setOrgId("");
    setContactId("");
    setAgentId("");
    setTitle("");
    setLabels("");
    setPriority("");
    setComplexity("");
    setStatus("");
    setOrgSummary([]);
  }

  return(
    <>
      <h2 class="title is-4" style={{marginBottom:"1.2em"}}>Creating Ticket</h2>
      <div class="columns">
        <div class="column is-one-quarter">
          <span>Title</span>
        </div>
        <div class="column">
          <input class="input" type="text" value={title} onChange={(e) => {
            setTitle(e.target.value);
          }} />
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-quarter">
          <span>Status</span>
        </div>
        <div class="column">
          <input class="input" type="text" value={status} onChange={(e) => {
            setStatus(e.target.value);
          }} />
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-quarter">
          <span>Organisation</span>
        </div>
        <div class="column">
          <input class="input" type="text" value={orgId} onChange={(e) => {
            // TODO: Convert to dropdown
            setOrgId(e.target.value);
          }} />
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-quarter">
          <span>Contact</span>
        </div>
        <div class="column">
          <input class="input" type="text" value={contactId} onChange={(e) => {
            // TODO: Convert to dropdown
            setContactId(e.target.value);
          }} />
          <select class="select">
            {orgSummary.map((i) => 
              <option value={i.id}>{i.name} COOL</option>
            )}
          </select>
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-quarter">
          <span>Agent</span>
        </div>
        <div class="column">
          <input class="input" type="text" value={agentId} onChange={(e) => {
            // TODO: Convert to dropdown
            setAgentId(e.target.value);
          }} />
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-quarter">
          <span>Priority</span>
        </div>
        <div class="column">
          <input class="input" type="text" value={priority} onChange={(e) => {
            // TODO: Convert to dropdown/slider
            setPriority(e.target.value);
          }} />
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-quarter">
          <span>Complexity</span>
        </div>
        <div class="column">
          <input class="input" type="text" value={complexity} onChange={(e) => {
            // TODO: Convert to dropdown/slider
            setComplexity(e.target.value);
          }} />
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-quarter">
          <span>Labels</span>
        </div>
        <div class="column">
          <input class="input" type="text" value={labels} onChange={(e) => {
            setLabels(e.target.value);
          }} />
        </div>
      </div>
      <div style={{width:"100%", textAlign:"center"}}>
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
            reportDate: moment()
          }).then(() => {
            clearObject();
          });
        }}>Create Ticket</button>
        <button class="button is-warning" style={{margin:"0.4em"}} onClick={async (e) => {
          e.preventDefault();
          clearObject();
        }}>Clear Fields</button>
      </div>
    </>
  );
}