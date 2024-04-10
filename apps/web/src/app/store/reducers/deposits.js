import {
    CHANGE_DEPOSIT_STATUS,
    DELETE_DEPOSIT,
    DUPLICATE_DEPOSIT,
    FETCH_DEPOSITS,
    FETCH_DEPOSITS_COUNT,
    NEW_DEPOSIT
} from "../actions/types";

const initialState = {
    list: [],
    count: 0,
};

export default function depositsReducer(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case FETCH_DEPOSITS:
            return {count: payload.count, list: payload.deposits};
        case FETCH_DEPOSITS_COUNT:
            return {...state, count: payload.count};
        case DUPLICATE_DEPOSIT:
            return {count: payload.count + 1, list: [payload.deposit, ...state.list]}
        case CHANGE_DEPOSIT_STATUS:
            return {
                ...state,
                list: [...state.list].map(deposit => {
                    if (parseInt(deposit.id) === parseInt(payload.id)) {
                        return {...deposit, status: payload.status};
                    }
                    return deposit;
                }),
            };
        case NEW_DEPOSIT:
            return {...state, list: [payload.deposit, ...state.list]};
        case DELETE_DEPOSIT:
            return {
                count: state.count - 1,
                list: [...state.list].filter(deposit => parseInt(deposit.id) !== parseInt(payload.id)),
            };
        default:
            return state;
    }
}
