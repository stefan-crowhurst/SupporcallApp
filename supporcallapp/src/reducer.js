/**
 * Reducer for updating the store
 * 
 * @param {*} state The current state
 * @param {*} action The action payload
 * @returns Updated state object
 */
export const Reducer = (state, action) => {
  switch (action.type) {
    case "LOGGED_IN":
      return {
        ...state,
        loggedIn: true,
        isAdminLoggedIn: action.payload.isAdminLoggedIn,
        loggedInAgentId: action.payload.loggedInAgentId
      };
    case "LOGGED_OUT":
      return {
        ...state,
        loggedIn: false,
        isAdminLoggedIn: false,
        loggedInAgentId: ""
      };
    case "UPDATE_NUMBER":
      return {
        ...state,
        numToCall:action.payload.numToCall
      };
    default:
      return state;
  }
}