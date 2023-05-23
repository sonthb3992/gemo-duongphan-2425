import { createStore } from "redux";
import rootReducer from "../index";

// Create Redux Store
const store = createStore(rootReducer);

export default store;
