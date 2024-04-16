import {AlertType} from "../types";
import {AlertState} from "@coinvant/types";

export const showAlert = (payload: AlertState) => ({
    type: AlertType.SHOW,
    payload,
});

export const hideAlert = () => ({
    type: AlertType.HIDE,
});
