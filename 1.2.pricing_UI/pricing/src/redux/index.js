import { combineReducers } from "redux";
import cartReducer from "./reducers/cartReducer";
import alertReducer from "./reducers/alertReducer";

// Combine Reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  alert: alertReducer,
});

export default rootReducer;
