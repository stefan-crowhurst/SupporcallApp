import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import "../bstyles.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressBook, faBuilding, faChartLine, faHome, faTicketAlt, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { Context } from '../store';
import { Dialler } from './dialler';

/**
 * Persistent toolbar incl. links to pages and dialler
 * 
 * @returns Toolbar with dialler and page links
 */
export const Toolbar = () => {
  const [store, dispatch] = useContext(Context);

  // Common CSS and styling classes:
  const navBtnClass = "button is-light is-outlined is-inverted level-item";
  const navBtnStyle = {
    "borderRadius":"0px",
    "border":"0",
    "margin": "0",
  };

  return (
    <>
      <nav class="level is-mobile" style={{borderBottom:"1px solid #CCCCCC"}}>
        <div class="level-left">
          <Link to="/" class="level-item"><img src="../../supporcall-small.png" width="112" height="28" style={{paddingLeft:"6%"}} alt="Logo" /></Link>
          <Link to="/" class={navBtnClass} style={navBtnStyle}>
            <span class="icon"><FontAwesomeIcon icon={faHome} /></span>
            <span>Home</span>
          </Link>
          <Link to="/tickets" class={navBtnClass} style={navBtnStyle}>
            <span class="icon"><FontAwesomeIcon icon={faTicketAlt} /></span>
            <span>Tickets</span>
          </Link>
          <Link to="/agents" class={navBtnClass} style={navBtnStyle}>
            <span class="icon"><FontAwesomeIcon icon={faUserSecret} /></span>
            <span>Agents</span>
          </Link>
          <Link to="/contacts" class={navBtnClass} style={navBtnStyle}>
            <span class="icon"><FontAwesomeIcon icon={faAddressBook} /></span>
            <span>Contacts</span>
          </Link>
          <Link to="/organisations" class={navBtnClass} style={navBtnStyle}>
            <span class="icon"><FontAwesomeIcon  icon={faBuilding} /></span>
            <span>Organisations</span>
          </Link>
          <Link to="/reports" class={navBtnClass} style={navBtnStyle}>
            <span class="icon"><FontAwesomeIcon  icon={faChartLine} /></span>
            <span>Reports</span>
          </Link>
        </div>
        <div class="level-right">
          {/* render dialler if agent loigged in */}
          {store.loggedIn ? 
            <>
              <Dialler />
            </>
          : null}
          {/* Render log in/out button */}
          {store.loggedIn ?
            <button class="button is-primary" onClick={() => {
              dispatch({type: "LOGGED_OUT"});
            }}>Log Out</button>
          :
            <Link to="/login" class="level-item button is-primary" style={navBtnStyle}>Log in</Link>
          }
        </div>
      </nav>
    </>
  );
}
