import {combineReducers} from "@reduxjs/toolkit";
import auth from "./auth";
import alert from "./alert";
import modal from "./modal";
import user from "./user";
import paymentMethod from "./payment-method";
import deposit from "./deposit";
import withdrawal from "./withdrawal";
import transaction from "./transaction";

export default combineReducers({
  auth,
  alert,
  modal,
  user,
  paymentMethod,
  deposit,
  withdrawal,
  transaction,
});
