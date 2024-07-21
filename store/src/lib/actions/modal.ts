import {ModalActions} from "../types";
import {Modals} from "@coinvant/types";

export const openModal = (activeModal: Modals) => ({
    type: ModalActions.OPEN,
    payload: activeModal,
});

export const closeModal = () => ({
    type: ModalActions.CLOSE,
});
