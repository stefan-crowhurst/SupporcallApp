import React, {createContext, useReducer} from 'react';
import { Reducer } from "./reducer";

const initialState = {
  loggedIn: false,
  isAdminLoggedIn: false,
  loggedInAgentId: "",
  numToCall: ""
};

export const Store = ({children}) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return(
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
}

export const Context = createContext(initialState);