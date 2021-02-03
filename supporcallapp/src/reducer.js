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
    default:
      return state;
  }
}