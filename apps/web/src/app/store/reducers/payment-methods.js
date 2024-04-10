import {
    ADD_PAYMENT_METHOD,
    DELETE_PAYMENT_METHOD,
    EDIT_PAYMENT_METHOD,
    FETCH_PAYMENT_METHODS,
} from "../actions/types";

const initialState = {
    list: [],
    count: 0,
};

export default function paymentMethodsReducer(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case FETCH_PAYMENT_METHODS:
            return {count: payload.count, list: payload.paymentMethods};
        case ADD_PAYMENT_METHOD:
            return {
                count: payload.count + 1,
                list: [payload.paymentMethod, ...state.list],
            }
        case EDIT_PAYMENT_METHOD:
            return {
                list: [...state.list].map(paymentMethod => {
                    if (parseInt(paymentMethod.id) === parseInt(payload.paymentMethod.id)) {
                        return payload.paymentMethod;
                    }
                    return paymentMethod;
                }),
            }
        case DELETE_PAYMENT_METHOD:
            return {
                count: payload.count - 1,
                list: [...state.list].filter(paymentMethod => paymentMethod.id !== payload.id),
            }
        default:
            return state;
    }
}