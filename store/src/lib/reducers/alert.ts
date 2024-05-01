import {PayloadAction} from "@reduxjs/toolkit";
import {AlertType} from "../types";
import {AlertState} from "@coinvant/types";

const initialState: AlertState = {
  message: null,
  type: null,
  show: false,
};

const reducer = (state = initialState, action: PayloadAction<AlertState>) => {
    const { type, payload } = action;

    switch (type) {
        case AlertType.SHOW:
          return payload;
        case AlertType.HIDE:
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
