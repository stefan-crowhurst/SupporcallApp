import { useParams } from "react-router-dom";
import { ResponsesView } from "./responsesview";
import { TicketDetailsView } from "./ticketdetailsview";

export const TicketView = () => {
  const { ticketid } = useParams();

  return (
    <>
      <div class="level">
        <div class="level-left">
          <h2 class="title is-4 level-item">Ticket: {ticketid}</h2>
        </div>
        {/* TODO: Maybe a refresh button here? I'd have to play with props then but might be worth it?
        Possibly implement after responses view stuff so both can be updated by this button? */}
      </div>
      <div class="columns">
        <div class="column is-one-third">
          <TicketDetailsView />
        </div>
        <div class="column">
          <ResponsesView />
        </div>
      </div>
    </>
  );
}