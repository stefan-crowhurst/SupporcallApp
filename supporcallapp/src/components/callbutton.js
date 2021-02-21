import React, { useContext } from 'react';
import "../bstyles.scss";
import { Context } from "../store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

export const CallButton = (params) => {
  const [store, dispatch] = useContext(Context);
  const btnStyle = {
    "borderRadius":"200px",
    "border":"0",
    "margin": "0",
  };

  return (
    <button class="button is-success is-small" style={btnStyle} onClick={() => {
      dispatch({type: "UPDATE_NUMBER", payload: {numToCall: params.number}});
      document.getElementById("dialler-modal").classList.add("is-active");
    }}>
      <span class="icon">
        <FontAwesomeIcon size="lg" icon={faPhone} />
      </span>
    </button>
  );
}