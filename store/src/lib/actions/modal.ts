import {ModalType} from "../types";
import {ModalState} from "@coinvant/types";

export const openModal = (payload: ModalState) => ({
    type: ModalType.OPEN,
    payload,
});

export const closeModal = () => ({
    type: ModalType.CLOSE,
});
