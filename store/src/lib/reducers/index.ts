import {combineReducers} from "@reduxjs/toolkit";
import auth from "./auth";
import alert from "./alert";
import modal from "./modal";

export default combineReducers({
  auth,
  alert,
  modal,
});
