import {Modals, ModalState} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {ModalActions} from "../types";

const initialState: ModalState = {
  activeModal: Modals.transactions,
}

const reducer = (state = initialState, action: PayloadAction<Modals>) => {
  switch (action.type) {
    case ModalActions.OPEN:
      return { activeModal: action.payload };
    case ModalActions.CLOSE:
      return { activeModal: null };
    default:
      return state;
  }
}

export default reducer;
