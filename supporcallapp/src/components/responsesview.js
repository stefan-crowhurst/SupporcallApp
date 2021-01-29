import { useParams } from "react-router-dom";

export const ResponsesView = () => {
  const { ticketid } = useParams();

  return (
    <div>
      responses {ticketid}
    </div>
  );
}