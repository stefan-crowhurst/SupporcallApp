import React from 'react';
import { Link } from "react-router-dom";
import "../bstyles.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressBook, faChartLine, faChevronDown, faHome, faPhoneSquareAlt, faTicketAlt, faUserSecret } from '@fortawesome/free-solid-svg-icons';

const navBtnClass = "button is-light is-outlined is-inverted level-item";
const navBtnStyle = {
  "borderRadius":"0px",
  "border":"0",
  "margin": "0",
};

export const Toolbar = () => {
  return (
    <>
      <nav class="level is-mobile" style={{borderBottom:"1px solid #CCCCCC"}}> {/*need to update this if the $border colour is updated at a later date*/}
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
          <Link to="/reports" class={navBtnClass} style={navBtnStyle}>
            <span class="icon"><FontAwesomeIcon  icon={faChartLine} /></span>
            <span>Reports</span>
          </Link>
        </div>
        <div class="level-right">
          <div class={navBtnClass} style={navBtnStyle}><span class="icon"><FontAwesomeIcon size="lg" icon={faPhoneSquareAlt} /></span></div>
          <div class="dropdown is-hoverable">
            <div class="dropdown-trigger">
              <button class={navBtnClass} aria-haspopup="true" aria-controls="status-dropdown" style={navBtnStyle}>
                <span>Status</span> {/*this should probably show the current status with an icon when that feature is implemented*/}
                <span class="icon"><FontAwesomeIcon icon={faChevronDown} /></span>
              </button>
            </div>
            <div class="dropdown-menu" id="status-dropdown" role="menu">
              <div class="dropdown-content">
                {/*eslint-disable-next-line*/}
                <a class="dropdown-item">Available</a>
                {/*eslint-disable-next-line*/}
                <a class="dropdown-item">Unavailable</a>
                {/*eslint-disable-next-line*/}
                <a class="dropdown-item">Offline</a>
              </div>
            </div>
          </div>
          <div class="level-item button is-primary" style={navBtnStyle}>Log in</div>
        </div>
      </nav>
    </>
  );
}
