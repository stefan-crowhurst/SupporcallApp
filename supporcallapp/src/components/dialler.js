import React, { useState, useContext, useEffect } from 'react';
import "../bstyles.scss";
import axios from "axios";
import { Device } from "twilio-client";
import { Context } from "../store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace, faCheck, faMicrophone, faMicrophoneSlash, faPhone, faPhoneSlash, faPhoneSquareAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

export const Dialler = () => {
  var [isReady, setIsReady] = useState(false);
  var [isIncoming, setIsIncoming] = useState(false);
  var [currentCall, setCurrentCall] = useState(null);
  var [isMuted, setIsMuted] = useState(false);
  const [store, dispatch] = useContext(Context);
  var [device, setDevice] = useState(new Device());
  const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
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
    axios.get(`https://supporcallapi.azurewebsites.net/api/Twilio/token/A0`).then((r) => {
      // using fakeLocalDTMF can prevent tones doubling up in some cases
      if (update) {
        device.updateToken(r.data);
      }
      else {
        device.setup(r.data, {fakeLocalDTMF:true});
      }
      device.on("ready", () => {
        setIsReady(true);
      });
      device.on("incoming", (c) => {
        c.on("accept", (c) => {
          setCurrentCall(c);
          setIsIncoming(false);
        });
        c.on("ignore", () => {
          setIsIncoming(false);
          setCurrentCall(null);
        });
        c.on("cancel", () => {
          setIsIncoming(false);
          setCurrentCall(null);
        });
        setCurrentCall(c);
        setIsIncoming(true);
        document.getElementById("dialler-modal").classList.add("is-active"); // open the dialler when we get a call
      });
      device.on("connect", (c) => {
        c.on("disconnect", () => {
          setIsMuted(false);
          setCurrentCall(null);
        });
        setCurrentCall(c);
      });
      device.on("error", (e) => console.error(e));
      device.on("offline", () => {
        setIsReady(false);
        // call this function again to reconstruct the device
        refreshDevice(true);
      })
    });
  }

  return (
    <>
      {isReady ?
        <>
          <div class={navBtnClass} style={navBtnStyle} onClick={() => {
            document.getElementById("dialler-modal").classList.add("is-active");
          }}>
            <span class="icon">
              <FontAwesomeIcon size="lg" icon={faPhoneSquareAlt} />
            </span>
          </div>
          <div id="dialler-modal" class="modal" style={{fontSize:"1.5em"}}>
            <div class="modal-background" onClick={() => document.getElementById("dialler-modal").className = document.getElementById("dialler-modal").className.replace("is-active", "")} />
            <div class="modal-content" style={{width:"auto", maxWidth:"50%"}}>
              <div class="card">
                <div class="card-header" style={{paddingRight:"0.5em"}}>
                  <div class="card-header-title">Dialler</div>
                  <button class="delete is-large card-header-icon" style={{margin:"auto"}} onClick={() => document.getElementById("dialler-modal").className = document.getElementById("dialler-modal").className.replace("is-active", "")} />
                </div>
                <div class="card-content">
                  {isIncoming ?
                    <div style={{paddingBottom:"1em"}}>
                      Call incoming from {currentCall.parameters.From}
                    </div>
                  :
                    <>
                      <div class="columns">
                        {currentCall ?
                          <div class="column has-text-centered">
                            On call with: {currentCall._direction == "OUTGOING" ? (store.numToCall.startsWith("+44") ? store.numToCall : "+44" + store.numToCall) : currentCall.parameters.From}
                          </div>
                        :
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
                                  dispatch({type: "UPDATE_NUMBER", payload: {numToCall: store.numToCall.slice(0, -1)}});
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
                      <div class="column has-text-centered">
                        <div class="button is-success" style={diallerKeyStyle} onClick={() => {
                          if (isIncoming) {
                            currentCall.accept();
                          } else {
                            var callNum = "+44" + (store.numToCall.startsWith("+44") ? store.numToCall.substring(3) : store.numToCall);
                            try {
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
                      : <></> }
                      {/* Only render on incoming, or on a call */}
                      {currentCall ?
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
                      : <></>}
                      {/* Only render when on a call */}
                      {currentCall && !isIncoming ?
                        <div class="column has-text-centered">
                          <div class="button is-warning" style={diallerKeyStyle} onClick={() => {
                            // mute or unmute the device
                            const newState = !currentCall.isMuted(); // just to make sure there is no disparity here
                            currentCall.mute(newState);
                            setIsMuted(newState);
                          }}>
                            {isMuted ? <FontAwesomeIcon icon={faMicrophone} /> : <FontAwesomeIcon icon={faMicrophoneSlash} />}
                          </div>
                        </div>
                      : <></> }
                    </div>
                </div>
              </div>
            </div>
          </div>
        </>
      :
        <div class={navBtnClass + " disabled"} disabled style={navBtnStyle}><span class="icon"><FontAwesomeIcon size="lg" icon={faPhoneSquareAlt} /></span></div>
      }
    </>
  );
}