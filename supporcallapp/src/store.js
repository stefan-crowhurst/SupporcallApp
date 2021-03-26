import React, {createContext, useReducer} from 'react';
import { Reducer } from "./reducer";

const initialState = {
  loggedIn: false,
  isAdminLoggedIn: false,
  loggedInAgentId: "",
  numToCall: ""
};

/**
 * Global store component
 * 
 * @param {*} param0 Child elements to render
 * @returns Children + context provider
 */
export const Store = ({children}) => {
  // initialise the store state with the reducer and initial state
  const [state, dispatch] = useReducer(Reducer, initialState);

  return(
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
}

export const Context = createContext(initialState);