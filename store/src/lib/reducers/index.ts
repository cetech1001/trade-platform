import {combineReducers} from "@reduxjs/toolkit";
import auth from "./auth";
import alert from "./alert";
import modal from "./modal";
import user from "./user";
import paymentMethod from "./payment-method";
import deposit from "./deposit";
import withdrawal from "./withdrawal";
import transaction from "./transaction";
import tradeAsset from "./trade-asset";
import trade from "./trade";
import account from "./account";

export default combineReducers({
  auth,
  alert,
  modal,
  user,
  paymentMethod,
  deposit,
  withdrawal,
  transaction,
  tradeAsset,
  trade,
  account,
});
