import {combineReducers} from "@reduxjs/toolkit";
import auth from "./auth";
import alert from "./alert";

export default combineReducers({
  auth,
  alert,
});
