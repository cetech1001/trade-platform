import {PayloadAction} from "@reduxjs/toolkit";
import {AlertActions} from "../types";
import {AlertState} from "@coinvant/types";

const initialState: AlertState = {
  message: null,
  type: null,
  show: false,
};

const reducer = (state = initialState, action: PayloadAction<AlertState>) => {
    const { type, payload } = action;

    switch (type) {
        case AlertActions.SHOW:
          return payload;
        case AlertActions.HIDE:
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
