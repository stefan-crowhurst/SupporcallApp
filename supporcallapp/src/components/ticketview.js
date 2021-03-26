import { useParams } from "react-router-dom";
import { RepliesView } from "./repliesview";
import { TicketDetailsView } from "./ticketdetailsview";

/**
 * Parent component for ticket details and replies.
 * Requires parent to have ticketid.
 * 
 * @returns Full ticket detail view incl. details and replies
 */
export const TicketView = () => {
  const { ticketid } = useParams();

  return (
    <>
      <div class="level">
        <div class="level-left">
          <h2 class="title is-4 level-item">Ticket: {ticketid}</h2>
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-third">
          <TicketDetailsView />
        </div>
        <div class="column">
          <RepliesView />
        </div>
      </div>
    </>
  );
}