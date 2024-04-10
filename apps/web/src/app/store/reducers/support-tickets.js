import {
    CHANGE_SUPPORT_TICKET_STATUS,
    FETCH_SUPPORT_TICKETS,
    FETCH_SUPPORT_TICKETS_COUNT,
    NEW_SUPPORT_TICKET
} from "../actions/types";

const initialState = {
    list: [],
    count: 0,
};

export default function supportTicketsReducer(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case FETCH_SUPPORT_TICKETS:
            return {count: payload.count, list: payload.tickets};
        case FETCH_SUPPORT_TICKETS_COUNT:
            return {...state, count: payload.count};
        case CHANGE_SUPPORT_TICKET_STATUS:
            return {
                ...state,
                list: [...state.list].map(ticket => {
                    if (parseInt(ticket.id) === parseInt(payload.id)) {
                        return {...ticket, status: payload.status};
                    }
                    return ticket;
                }),
            };
        case NEW_SUPPORT_TICKET:
            return {...state, list: [payload.ticket, ...state.list]};
        default:
            return state;
    }
}