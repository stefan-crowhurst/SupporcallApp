import React from 'react';
import { Link } from "react-router-dom";
import "../bstyles.scss";

export const Toolbar = () => {
  return (
    <>
      <nav class="level is-mobile">
        <div class="level-left">
          <Link to="/" class="level-item"><img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" alt="Logo" /></Link>
          <Link to="/" class="level-item button is-light">Home</Link>
          <Link to="/tickets" class="level-item button is-light">Tickets</Link>
          <Link to="/agents" class="level-item button is-light">Agents</Link>
          <Link to="/contacts" class="level-item button is-light">Contacts</Link>
          <Link to="/reports" class="level-item button is-light">Reports</Link>
        </div>
        <div class="level-right">
          <div class="level-item button is-light">Dialler</div>
          <div class="level-item button is-light">Status</div>
          <div class="level-item button is-primary">Log in</div>
        </div>
      </nav>
    </>
  );
}
