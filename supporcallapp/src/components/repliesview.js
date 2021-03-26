import { faReply, faSync } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { Context } from '../store';

/**
 * Shows all replies to a ticket and allow user to add more replies
 * Requires ticketid in parent.
 * 
 * @returns UI for current replies/notes and adding replies/notes
 */
export const RepliesView = () => {
  const { ticketid } = useParams(); // get ticket id from parent
  let [responses, setResponses] = useState([]);
  let [isLoading, setIsLoading] = useState(true);
  let [isInternalNote, setIsInternalNote] = useState(false);
  const contactAddress = "Supporcall App";
  let [ticketReplyContent, setTicketReplyContent] = useState("");
  let [ticketReplyType, setTicketReplyType] = useState("Email");
  const [store] = useContext(Context);

  useEffect(() => {
    refreshResponses();
  }, []);

  async function refreshResponses() {
    setResponses([]);
    setIsLoading(true);
    axios.get(`https://supporcallapi.azurewebsites.net/api/Tickets/replies/${ticketid}`).then((r) => {
      setResponses(r.data);
      setIsLoading(false);
    });
  }

  return (
    <div class="box">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <h2 class="title is-4">Ticket Responses:</h2>
          </div>
        </div>
        <div class="level-right">
          <button class="button is-rounded is-light level-item" onClick={(e) => {
            e.preventDefault();
            refreshResponses();
          }}>
            <span class="icon"><FontAwesomeIcon icon={faSync} /></span>
          </button>
        </div>
      </div>
      {isLoading ?
        // show loading bar while api req is made
        <div style={{width:"100%", textAlign:"center"}}>
          <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
          <h3><b>Loading ticket responses...</b></h3>
        </div>
      : responses.length > 0 ?
        // if there are replies/notes
        responses.map((r) => 
          // map replies/notes to elements and style according to the data
          <div id={`Reply ${r.replyIndex}`} style={r.internalNote ? {backgroundColor:"#fff8cc", width:"100%", padding:"1.25rem", borderBottom:"1px solid #d0d0d0"} : {width:"100%", padding:"1.25rem", borderBottom:"1px solid #d0d0d0"}}>
            <div class="level" style={{marginBottom:"0.5em"}}>
              <div class="level-left">
                <h3 class="title is-6">#{r.replyIndex} {r.internalNote ? "Internal Note" : "Reply"} - At {moment(r.repliedAt).format("HH:mm DD/MM/YY")}</h3>
              </div>
              <div class="level-left">
                <h3 class="title is-6">From {r.replierId + " via"} {r.contactAddress} by {r.replyType}</h3>
              </div>
            </div>
            <div>{r.replyContent}</div>
          </div>
        )
      :
        <div style={{width:"100%", textAlign:"center"}}>
          <h3><b>No responses found</b></h3>
        </div>
      }
      {/* Reply addition form */}
      <div style={{padding:"1.25rem"}}>
        <div class="level">
          <div class="level-left">
            <h3 class="title is-5">Add a reply</h3>
          </div>
        </div>
        <textarea class="textarea" placeholder="Write your reply here..." style={{marginBottom:"1em"}} value={ticketReplyContent} onChange={(e) => setTicketReplyContent(e.target.value)} />
        <div style={{display:"flex", justifyContent:"flex-end", alignItems:"center", width:"100%"}}>
          <div class="checkbox" style={{paddingRight:"2em"}}> {/* Toggle whether reply is internal note or not */}
            <input type="checkbox" id="internalnotecheck" checked={isInternalNote} onChange={(e) => {
              setIsInternalNote(e.target.checked);
              if (ticketReplyType === "Note") {
                setTicketReplyType("Email");
              } else {
                setTicketReplyType("Note");
              }
            }} />
            <label for="internalnotecheck" style={{marginLeft:"0.5em"}}>Make internal note?</label>
          </div>
          <button class="button is-primary" onClick={(e) => {
            e.preventDefault();
            axios.post(`https://supporcallapi.azurewebsites.net/api/Tickets/replies/${ticketid}`, {
              replierId: store.loggedInAgentId,
              replyContent: ticketReplyContent,
              contactAddress: contactAddress,
              internalNote: isInternalNote ? 1 : 0,
              replyType: ticketReplyType,
              requesterId: store.loggedInAgentId
            }).then(() => {
              refreshResponses();
              setTicketReplyContent("");
              setIsInternalNote(false);
            });
          }}>
            <span class="icon">
              <FontAwesomeIcon icon={faReply} />
            </span>
            <span>Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
}