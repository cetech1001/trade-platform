import {combineReducers} from "redux";
import auth from "./auth";
import message from "./message";
import users from "./users";
import plans from "./pairs";
import paymentMethods from "./payment-methods";
import investments from "./trades";
import supportTickets from "./support-tickets";
import kyc from "./kyc";
import referrals from "./referrals";
import deposits from "./deposits";
import withdrawals from "./withdrawals";

export default combineReducers({
    auth,
    message,
    users,
    plans,
    paymentMethods,
    investments,
    supportTickets,
    kyc,
    referrals,
    deposits,
    withdrawals,
});
