import React from "react";
import { Link } from "react-router-dom";

/**
 * Simple blocker page indicating that user needs to log in
 * 
 * @returns Not logged in warning page
 */
export const LoginWarning = () => {
  return(
    <>
      <div class="notification is-warning" style={{textAlign:"center"}}>
        <div style={{width:"100%", marginBottom:"1em"}}>
          <span>You must be logged in to access this system</span>
        </div>
        <Link to="/login" class="button is-primary">Log In</Link>
      </div>
    </>
  );
}