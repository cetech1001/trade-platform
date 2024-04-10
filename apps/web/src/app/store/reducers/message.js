import { SET_MESSAGE, CLEAR_MESSAGE } from "../actions/types";

const initialState = {
    message: null,
    show: false,
    type: null,
};

export default function message(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_MESSAGE:
            return { ...payload };

        case CLEAR_MESSAGE:
            return {
                message: null,
                show: false,
                type: null,
            };

        default:
            return state;
    }
}