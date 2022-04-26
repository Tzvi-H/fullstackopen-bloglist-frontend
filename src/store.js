import { createStore, combineReducers } from "redux";
import notificationReducer from "./reducers/notificationReducer";

const reducer = combineReducers({
  notification: notificationReducer,
});

const store = createStore(reducer);

export default store;
