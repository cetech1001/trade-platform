import {
    CHANGE_SUPPORT_TICKET_STATUS,
    FETCH_SUPPORT_TICKETS,
    FETCH_SUPPORT_TICKETS_COUNT,
    NEW_SUPPORT_TICKET
} from "./types";
import SupportTicketService from "../../services/support-ticket.service";
import {setMessage} from "./message";

export const fetchSupportTickets = (params) => dispatch => {
    return SupportTicketService.fetchSupportTickets(params)
        .then(
            ({supportTickets, count}) => {
                dispatch({
                    type: FETCH_SUPPORT_TICKETS,
                    payload: {
                        tickets: supportTickets,
                        count,
                    },
                });
                return Promise.resolve();
            },
            error => {
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                dispatch(setMessage({
                    message: message,
                    type: 'danger',
                    show: true,
                }));
                return Promise.reject();
            }
        );
}

export const fetchSupportTicketsCount = () => dispatch => {
    return SupportTicketService.fetchSupportTicketsCount()
        .then(
            ({count}) => {
                dispatch({
                    type: FETCH_SUPPORT_TICKETS_COUNT,
                    payload: {
                        count,
                    },
                });
                return Promise.resolve();
            },
            error => {
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                dispatch(setMessage({
                    message: message,
                    type: 'danger',
                    show: true,
                }));
                return Promise.reject();
            }
        );
}

export const changeSupportTicketStatus = (id, status) => dispatch => {
    return SupportTicketService.changeSupportTicketStatus(id, status)
        .then(
            () => {
                dispatch({
                    type: CHANGE_SUPPORT_TICKET_STATUS,
                    payload: {
                        id,
                        status
                    },
                });
                dispatch(setMessage({
                    message: 'Support ' + status,
                    type: 'success',
                    show: true,
                }));
                return Promise.resolve();
            },
            error => {
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                dispatch(setMessage({
                    message: message,
                    type: 'danger',
                    show: true,
                }));
                return Promise.reject();
            }
        );
}

export const newSupportTicket = (data) => dispatch => {
    return SupportTicketService.newSupportTicket(data)
        .then(
            ticket => {
                dispatch({
                    type: NEW_SUPPORT_TICKET,
                    payload: {
                        ticket,
                    },
                });
                return Promise.resolve();
            },
            error => {
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                dispatch(setMessage({
                    message: message,
                    type: 'danger',
                    show: true,
                }));
                return Promise.reject();
            }
        );
}