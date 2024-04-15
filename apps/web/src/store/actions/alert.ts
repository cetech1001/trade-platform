import {AlertTypes} from "../types/alert";
import {AlertState} from "@coinvant/types";

export const showAlert = (payload: AlertState) => ({
    type: AlertTypes.SHOW_ALERT,
    payload,
});

export const hideAlert = () => ({
    type: AlertTypes.HIDE_ALERT,
});
