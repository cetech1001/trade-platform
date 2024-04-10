import {ADD_PLAN, DELETE_PLAN, EDIT_PLAN, FETCH_PLANS} from "../actions/types";

const initialState = {
    list: [],
    count: 0,
};

export default function plansReducer(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case FETCH_PLANS:
            return {count: payload.count, list: payload.plans};
        case ADD_PLAN:
            return {
                count: payload.count + 1,
                list: [payload.plan, ...state.list],
            }
        case EDIT_PLAN:
            return {
                ...state,
                list: [...state.list].map(plan => {
                    if (parseInt(plan.id) === parseInt(payload.plan.id)) {
                        return payload.plan;
                    }
                    return plan;
                }),
            }
        case DELETE_PLAN:
            return {
                count: payload.count - 1,
                list: [...state.list].filter(plan => plan.id !== payload.id),
            }
        default:
            return state;
    }
}