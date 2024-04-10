import {
    CHANGE_INVESTMENT_STATUS, DELETE_INVESTMENT,
    DUPLICATE_INVESTMENT,
    FETCH_INVESTMENT,
    FETCH_INVESTMENTS, FETCH_INVESTMENTS_COUNT,
    NEW_INVESTMENT
} from "../actions/types";

const initialState = {
    list: [],
    currentInvestment: null,
    count: 0,
};

export default function investmentsReducer(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case FETCH_INVESTMENTS:
            return {...state, count: payload.count, list: payload.investments};
        case FETCH_INVESTMENTS_COUNT:
            return {...state, count: payload.count};
        case FETCH_INVESTMENT:
            return {...state, currentInvestment: payload.investment};
        case DUPLICATE_INVESTMENT:
            return {...state, count: payload.count + 1, list: [payload.investment, ...state.list]};
        case CHANGE_INVESTMENT_STATUS:
            return {
                ...state,
                list: [...state.list].map(investment => {
                    if (parseInt(investment.id) === parseInt(payload.id)) {
                        let status = payload.status;
                        if (payload.status === 'activated') {
                            status = 'active';
                        }
                        return {...investment, status};
                    }
                    return investment;
                }),
            };
        case NEW_INVESTMENT:
            return {...state, list: [payload.investment, ...state.list]};
        case DELETE_INVESTMENT:
            return {
                currentInvestment: null,
                count: state.count - 1,
                list: [...state.list].filter(investment => parseInt(payload.id) !== parseInt(investment.id))
            }
        default:
            return state;
    }
}
