import {PayloadAction} from "@reduxjs/toolkit";
import {AlertTypes} from "../types/alert";

interface AlertState {
  message: string | null;
  type: 'success' | 'error' | null;
  show: boolean;
}

const initialState: AlertState = {
  message: null,
  type: null,
  show: false,
};

const reducer = (state = initialState, action: PayloadAction<AlertState>) => {
    const { type, payload } = action;

    switch (type) {
        case AlertTypes.SHOW_ALERT:
          return payload;
        case AlertTypes.HIDE_ALERT:
          return {
            message: null,
            type: null,
            show: false,
          };
        default:
          return state;
    }
};

export default reducer;
