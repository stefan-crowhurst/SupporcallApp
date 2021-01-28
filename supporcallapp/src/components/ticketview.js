import { useParams } from "react-router-dom";

export const TicketView = () => {
  const { ticketid } = useParams();

  return (
    <>ticket id {ticketid}</>
  );
}