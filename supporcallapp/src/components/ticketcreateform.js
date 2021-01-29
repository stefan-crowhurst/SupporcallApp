import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import BulmaTagsInput from '@creativebulma/bulma-tagsinput';

export const TicketCreateForm = () => {
  let [orgId, setOrgId] = useState("");
  let [contactId, setContactId] = useState("");
  let [agentId, setAgentId] = useState("");
  let [title, setTitle] = useState("");
  let [labels, setLabels] = useState("");
  let [priority, setPriority] = useState(1);
  let [complexity, setComplexity] = useState(1);
  let [status, setStatus] = useState("");
  // sla met will not be included since an SLA can't be met before creation
  // lastUpdatedAt is not included as this is handled by API automation (in this case it will be set to reportDate)
  let [orgSummary, setOrgSummary] = useState([]);
  let [contactSummary, setContactSummary] = useState([]);
  let [agentSummary, setAgentSummary] = useState([]);

  useEffect(() => {
    clearObject();
    updateSummaries();
    var inputTags = document.getElementById('labelstags');
    new BulmaTagsInput(inputTags);
    inputTags.BulmaTagsInput().on("after.add", (data) => {
      setLabels(inputTags.BulmaTagsInput().value);
      console.log(data);
      console.log(labels);
    });
    inputTags.BulmaTagsInput().on("after.remove", (data) => {
      setLabels(inputTags.BulmaTagsInput().value);
      console.log(data);
      console.log(labels);
    });
  }, []);

  function clearObject() {
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

  return(
    <>
      <h2 class="title is-4" style={{marginBottom:"1.2em"}}>Creating Ticket</h2>
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
            <select style={{width:"100%"}} onChange={(e) => {
              setStatus(e.target.value);
            }}>
              <option value="Open" selected>Open</option>
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
            <select style={{width:"100%"}} onChange={(e) => {
              setOrgId(e.target.value);
            }}>
              <option value="" style={{display:"none"}} disabled selected>Select Organisation</option>
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
            <select style={{width:"100%"}} onChange={(e) => {
              setContactId(e.target.value);
            }}>
              <option value="" style={{display:"none"}} disabled selected>Select Contact</option>
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
            <select style={{width:"100%"}} onChange={(e) => {
              setAgentId(e.target.value);
            }}>
              <option value="" style={{display:"none"}} disabled selected>Select Agent</option>
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
          <input id="labelstags" class="input" type="tags" placeholder="Enter label followed by comma" />
          <>{labels}</>
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