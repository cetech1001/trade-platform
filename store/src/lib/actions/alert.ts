import {AlertActions} from "../types";
import {AlertState} from "@coinvant/types";

export const showAlert = (payload: AlertState) => ({
    type: AlertActions.SHOW,
    payload,
});

export const hideAlert = () => ({
    type: AlertActions.HIDE,
});
