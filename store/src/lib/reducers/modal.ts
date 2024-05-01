import {ModalState} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {ModalType} from "../types";

const initialState: ModalState = {
  activeModal: null,
}

const reducer = (state = initialState, action: PayloadAction<ModalState>) => {
  switch (action.type) {
    case ModalType.OPEN:
      return { activeModal: action.payload.activeModal };
    case ModalType.CLOSE:
      return { activeModal: null };
    default:
      return state;
  }
}

export default reducer;
