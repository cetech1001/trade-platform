import {
    CHANGE_WITHDRAWAL_STATUS,
    DELETE_WITHDRAWAL,
    DUPLICATE_WITHDRAWAL,
    FETCH_WITHDRAWALS, FETCH_WITHDRAWALS_COUNT,
    NEW_WITHDRAWAL
} from "../actions/types";

const initialState = {
    list: [],
    count: 0,
};

export default function withdrawalsReducer(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case FETCH_WITHDRAWALS:
            return {count: payload.count, list: payload.withdrawals};
        case FETCH_WITHDRAWALS_COUNT:
            return {...state, count: payload.count};
        case DUPLICATE_WITHDRAWAL:
            return {count: payload.count + 1, list: [payload.withdrawal, ...state.list]};
        case CHANGE_WITHDRAWAL_STATUS:
            return {
                ...state,
                list: [...state.list].map(withdrawal => {
                    if (parseInt(withdrawal.id) === parseInt(payload.withdrawal.id)) {
                        return payload.withdrawal;
                    }
                    return withdrawal;
                }),
            };
        case NEW_WITHDRAWAL:
            return {...state, list: [payload.withdrawal, ...state.list]};
        case DELETE_WITHDRAWAL:
            return {
                count: payload.count - 1,
                list: [...state.list].filter(withdrawal => parseInt(payload.id) !== parseInt(withdrawal.id)),
            };
        default:
            return state;
    }
}
