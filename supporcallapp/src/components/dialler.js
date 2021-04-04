import React, { useState, useContext, useEffect } from 'react';
import "../bstyles.scss";
import axios from "axios";
import { Device } from "twilio-client";
import { Context } from "../store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace, faCheck, faMicrophone, faMicrophoneSlash, faPhone, faPhoneSlash, faPhoneSquareAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

/**
 * Twilio dialler popup tied to a button. Monitors and maintains device state.
 * 
 * @returns Dialler popup tied to button toggle
 */
export const Dialler = () => {
  var [isReady, setIsReady] = useState(false); // manage ready state
  var [isIncoming, setIsIncoming] = useState(false); // manage incoming state
  var [currentCall, setCurrentCall] = useState(null); // manage call state
  var [isMuted, setIsMuted] = useState(false); // manage muted state
  const [store, dispatch] = useContext(Context);
  var [device, setDevice] = useState(new Device()); // Twilio device
  const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance(); //used for number verification

  // Common CSS and styling classes:
  const navBtnClass = "button is-light is-outlined is-inverted level-item";
  const navBtnStyle = {
    "borderRadius":"0px",
    "border":"0",
    "margin": "0"
  };
  const diallerKeyStyle = {
    "borderRadius":"200px",
    "border":"0",
    "margin": "0",
    "maxWidth": "2.5em",
    "fontSize": "1em"
  };

  useEffect(() => {
    refreshDevice(false);
  }, []);

  function refreshDevice(update) {
    axios.get(`https://supporcallapi.azurewebsites.net/api/Twilio/token`).then((r) => {
      if (update) {
        device.updateToken(r.data); // refresh device token
      }
      else {
        device.setup(r.data, {fakeLocalDTMF:true}); // using fakeLocalDTMF can prevent tones doubling up in some cases
      }
      device.on("ready", () => {
        setIsReady(true); // allow dialler interaction now
      });
      device.on("incoming", (c) => {
        // call incoming
        c.on("accept", (c) => {
          // update state and store call data
          setCurrentCall(c);
          setIsIncoming(false);
        });
        c.on("ignore", () => {
          // clear state
          setIsIncoming(false);
          setCurrentCall(null);
        });
        c.on("cancel", () => {
          // clear state
          setIsIncoming(false);
          setCurrentCall(null);
        });
        setCurrentCall(c); // store call data
        setIsIncoming(true);
        document.getElementById("dialler-modal").classList.add("is-active"); // open the dialler when we get a call
      });
      device.on("connect", (c) => {
        // store call and set dc handler
        c.on("disconnect", () => {
          setIsMuted(false);
          setCurrentCall(null);
        });
        setCurrentCall(c);
      });
      device.on("error", (e) => console.error(e)); // basic error logging
      device.on("offline", () => {
        // token has expired, refresh device
        setIsReady(false);
        refreshDevice(true);
      })
    });
  }

  return (
    <>
      {isReady ?
        // when device is ready, render interactive dialler
        <>
          <div class={navBtnClass} style={navBtnStyle} onClick={() => {
            document.getElementById("dialler-modal").classList.add("is-active"); // toggle dialler
          }}>
            <span class="icon">
              <FontAwesomeIcon size="lg" icon={faPhoneSquareAlt} />
            </span>
          </div>
          <div id="dialler-modal" class="modal" style={{fontSize:"1.5em"}}>
            <div class="modal-background" onClick={() => document.getElementById("dialler-modal").className = document.getElementById("dialler-modal").className.replace("is-active", "") /* Toggle dialler when click background */} />
            <div class="modal-content" style={{width:"auto", maxWidth:"50%"}}>
              {/* Dialler display */}
              <div class="card">
                <div class="card-header" style={{paddingRight:"0.5em"}}>
                  <div class="card-header-title">Dialler</div>
                  <button class="delete is-large card-header-icon" style={{margin:"auto"}} onClick={() => document.getElementById("dialler-modal").className = document.getElementById("dialler-modal").className.replace("is-active", "")} />
                </div>
                <div class="card-content">
                  {isIncoming ?
                    // show incoming call text instead of dialpad
                    <div style={{paddingBottom:"1em"}}>
                      Call incoming from {currentCall.parameters.From}
                    </div>
                  :
                    // render dialpad
                    <>
                      <div class="columns">
                        {currentCall ?
                          // if on a call, show the number
                          <div class="column has-text-centered">
                            On call with: {currentCall._direction === "OUTGOING" ? (store.numToCall.startsWith("+44") ? store.numToCall : "+44" + store.numToCall) : currentCall.parameters.From}
                          </div>
                        :
                          // show number entry field
                          <>
                            <div class="column has-text-centered">
                              <div class="level">
                                <span class="level-item">+44</span>
                                <input class="input level-item" style={{maxWidth:"85%"}} type="tel" value={store.numToCall} onInput={(e) => {
                                  dispatch({type: "UPDATE_NUMBER", payload: {numToCall: e.target.value}});
                                }} />
                              </div>
                            </div>
                            <div class="column is-2 has-text-centered">
                              <div class="button is-light" onClick={() => {
                                if (store.numToCall.length > 0) {
                                  dispatch({type: "UPDATE_NUMBER", payload: {numToCall: store.numToCall.slice(0, -1)}}); // delete last digit of the number
                                }
                              }}>
                                <span class="icon">
                                  <FontAwesomeIcon size="lg" icon={faBackspace} />
                                </span>
                              </div>
                            </div>
                          </>
                        }
                      </div>
                      {/* Dialpad, if clicked while on call send DTMF, otherwise append to number entry */}
                      <div class="columns">
                        <div class="column has-text-centered">
                          <div class="button is-light" style={diallerKeyStyle} onClick={() => {
                            if (currentCall) {
                              currentCall.sendDigits('1');
                            } else {
                              dispatch({type: "UPDATE_NUMBER", payload: {numToCall: store.numToCall + "1"}});
                            }
                          }}>
                            <b>1</b>
                          </div>
                        </div>
                        <div class="column has-text-centered">
                          <div class="button is-light" style={diallerKeyStyle} onClick={() => {
                            if (currentCall) {
                              currentCall.sendDigits('2');
                            } else {
                              dispatch({type: "UPDATE_NUMBER", payload: {numToCall: store.numToCall + "2"}});
                            }
                          }}>
                            <b>2</b>
                          </div>
                        </div>
                        <div class="column has-text-centered">
                          <div class="button is-light" style={diallerKeyStyle} onClick={() => {
                            if (currentCall) {
                              currentCall.sendDigits('3');
                            } else {
                              dispatch({type: "UPDATE_NUMBER", payload: {numToCall: store.numToCall + "3"}});
                            }
                          }}>
                            <b>3</b>
                          </div>
                        </div>
                      </div>
                      <div class="columns">
                        <div class="column has-text-centered">
                          <div class="button is-light" style={diallerKeyStyle} onClick={() => {
                            if (currentCall) {
                              currentCall.sendDigits('4');
                            } else {
                              dispatch({type: "UPDATE_NUMBER", payload: {numToCall: store.numToCall + "4"}});
                            }
                          }}>
                            <b>4</b>
                          </div>
                        </div>
                        <div class="column has-text-centered">
                          <div class="button is-light" style={diallerKeyStyle} onClick={() => {
                            if (currentCall) {
                              currentCall.sendDigits('5');
                            } else {
                              dispatch({type: "UPDATE_NUMBER", payload: {numToCall: store.numToCall + "5"}});
                            }
                          }}>
                            <b>5</b>
                          </div>
                        </div>
                        <div class="column has-text-centered">
                          <div class="button is-light" style={diallerKeyStyle} onClick={() => {
                            if (currentCall) {
                              currentCall.sendDigits('6');
                            } else {
                              dispatch({type: "UPDATE_NUMBER", payload: {numToCall: store.numToCall + "6"}});
                            }
                          }}>
                            <b>6</b>
                          </div>
                        </div>
                      </div>
                      <div class="columns">
                        <div class="column has-text-centered">
                          <div class="button is-light" style={diallerKeyStyle} onClick={() => {
                            if (currentCall) {
                              currentCall.sendDigits('7');
                            } else {
                              dispatch({type: "UPDATE_NUMBER", payload: {numToCall: store.numToCall + "7"}});
                            }
                          }}>
                            <b>7</b>
                          </div>
                        </div>
                        <div class="column has-text-centered">
                          <div class="button is-light" style={diallerKeyStyle} onClick={() => {
                            if (currentCall) {
                              currentCall.sendDigits('8');
                            } else {
                              dispatch({type: "UPDATE_NUMBER", payload: {numToCall: store.numToCall + "8"}});
                            }
                          }}>
                            <b>8</b>
                          </div>
                        </div>
                        <div class="column has-text-centered">
                          <div class="button is-light" style={diallerKeyStyle} onClick={() => {
                            if (currentCall) {
                              currentCall.sendDigits('9');
                            } else {
                              dispatch({type: "UPDATE_NUMBER", payload: {numToCall: store.numToCall + "9"}});
                            }
                          }}>
                            <b>9</b>
                          </div>
                        </div>
                      </div>
                      <div class="columns">
                        <div class="column has-text-centered">
                          <div class="button is-light" style={diallerKeyStyle} onClick={() => {
                            if (currentCall) {
                              currentCall.sendDigits('*');
                            } else {
                              dispatch({type: "UPDATE_NUMBER", payload: {numToCall: store.numToCall + "*"}});
                            }
                          }}>
                            <b>*</b>
                          </div>
                        </div>
                        <div class="column has-text-centered">
                          <div class="button is-light" style={diallerKeyStyle} onClick={() => {
                            if (currentCall) {
                              currentCall.sendDigits('0');
                            } else {
                              dispatch({type: "UPDATE_NUMBER", payload: {numToCall: store.numToCall + "0"}});
                            }
                          }}>
                            <b>0</b>
                          </div>
                        </div>
                        <div class="column has-text-centered">
                          <div class="button is-light" style={diallerKeyStyle} onClick={() => {
                            if (currentCall) {
                              currentCall.sendDigits('#');
                            } else {
                              dispatch({type: "UPDATE_NUMBER", payload: {numToCall: store.numToCall + "#"}});
                            }
                          }}>
                            <b>#</b>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                  {/* Call interaction buttons */}
                  <div class="columns">
                    {!currentCall || isIncoming ?
                      // Accept call/dial number
                      <div class="column has-text-centered">
                        <div class="button is-success" style={diallerKeyStyle} onClick={() => {
                          if (isIncoming) {
                            currentCall.accept();
                          } else {
                            var callNum = "+44" + (store.numToCall.startsWith("+44") ? store.numToCall.substring(3) : store.numToCall);
                            try {
                              // validate entered number and dial
                              if (phoneUtil.isValidNumberForRegion(phoneUtil.parse(callNum, 'GB'), 'GB')) {
                                device.connect({callNum: callNum});
                              } else {
                                alert(`Invalid number provided: ${callNum}`);
                              }
                            } catch {
                              alert(`Invalid number provided: ${callNum}`);
                            }
                          }
                        }}>
                          <span class="icon">
                            {isIncoming ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faPhone} />}
                          </span>
                        </div>
                      </div>
                      : null }
                      {/* Only render on incoming, or on a call */}
                      {currentCall ?
                        // Ignore incoming or disconnect current call
                        <div class="column has-text-centered">
                          <div class="button is-danger" style={diallerKeyStyle} onClick={() => {
                            if (isIncoming) {
                              currentCall.ignore(); // using ignore instead of reject means it will be presented to other clients of the same name
                            } else {
                              currentCall.disconnect();
                            }
                          }}>
                            <span class="icon">
                              {isIncoming ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faPhoneSlash} />}
                            </span>
                          </div>
                        </div>
                      : null}
                      {/* Only render when on a call */}
                      {currentCall && !isIncoming ?
                        // Mute self toggle
                        <div class="column has-text-centered">
                          <div class="button is-warning" style={diallerKeyStyle} onClick={() => {
                            // mute or unmute the device
                            const newState = !currentCall.isMuted(); // just to make sure there is no disparity here
                            currentCall.mute(newState);
                            setIsMuted(newState);
                          }}>
                            {isMuted ? <FontAwesomeIcon icon={faMicrophoneSlash} /> : <FontAwesomeIcon icon={faMicrophone} />}
                          </div>
                        </div>
                      : null}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </>
      :
        // if device is not ready just render unusable button
        <div class={navBtnClass + " disabled"} disabled style={navBtnStyle}><span class="icon"><FontAwesomeIcon size="lg" icon={faPhoneSquareAlt} /></span></div>
      }
    </>
  );
}