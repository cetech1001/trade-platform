import {combineReducers} from "@reduxjs/toolkit";
import auth from "./auth";
import alert from "./alert";
import modal from "./modal";
import user from "./user";
import paymentMethod from "./payment-method";
import deposit from "./deposit";

export default combineReducers({
  auth,
  alert,
  modal,
  user,
  paymentMethod,
  deposit,
});
