import React, { useContext } from 'react';
import "../bstyles.scss";
import { Context } from "../store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

/**
 * Button used in various places throughout the application.
 * Acts as a shortcut to open the dialler with a given phone number.
 * 
 * @param {number} params The phone number to call
 * @returns Button element
 */
export const CallButton = (params) => {
  const [_store, dispatch] = useContext(Context);
  const btnStyle = {
    "borderRadius":"200px",
    "border":"0",
    "margin": "0",
  };

  return (
    <button class="button is-success is-small" style={btnStyle} onClick={() => {
      dispatch({type: "UPDATE_NUMBER", payload: {numToCall: params.number}}); // update stored number
      document.getElementById("dialler-modal").classList.add("is-active"); // open the dialler
    }}>
      <span class="icon">
        <FontAwesomeIcon size="lg" icon={faPhone} />
      </span>
    </button>
  );
}