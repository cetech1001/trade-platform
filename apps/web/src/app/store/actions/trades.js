import {
    CHANGE_INVESTMENT_STATUS, DELETE_INVESTMENT,
    DUPLICATE_INVESTMENT,
    FETCH_INVESTMENT,
    FETCH_INVESTMENTS, FETCH_INVESTMENTS_COUNT,
    NEW_INVESTMENT
} from "./types";
import InvestmentService from "../../services/trade.service";
import {setMessage} from "./message";

export const fetchInvestments = (params) => dispatch => {
    return InvestmentService.fetchInvestments(params)
        .then(
            ({investments, count}) => {
                dispatch({
                    type: FETCH_INVESTMENTS,
                    payload: {
                        investments,
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

export const fetchInvestmentsCount = (userID = '') => dispatch => {
    return InvestmentService.fetchInvestmentsCount(userID)
        .then(
            ({count}) => {
                dispatch({
                    type: FETCH_INVESTMENTS_COUNT,
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

export const pay = (id) => dispatch => {
    return InvestmentService.pay(id)
        .then(
            () => {
                return dispatch(fetchInvestments());
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

export const fetchInvestment = (id) => dispatch => {
    return InvestmentService.fetchInvestment(id)
        .then(
            investment => {
                dispatch({
                    type: FETCH_INVESTMENT,
                    payload: {
                        investment,
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

export const duplicateInvestment = (id) => dispatch => {
    return InvestmentService.duplicateInvestment(id)
        .then(
            investment => {
                dispatch({
                    type: DUPLICATE_INVESTMENT,
                    payload: {
                        investment,
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

export const changeInvestmentStatus = (id, status) => dispatch => {
    return InvestmentService.changeInvestmentStatus(id, status)
        .then(
            () => {
                dispatch({
                    type: CHANGE_INVESTMENT_STATUS,
                    payload: {
                        id,
                        status
                    },
                });
                dispatch(setMessage({
                    message: 'Investment ' + status,
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

export const newInvestment = data => dispatch => {
    return InvestmentService.newInvestment(data)
        .then(
            investment => {
                dispatch({
                    type: NEW_INVESTMENT,
                    payload: {
                        investment,
                    },
                });
                dispatch(setMessage({
                    show: true,
                    type: 'success',
                    message: 'New investment submitted',
                }));
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
        )
};

export const deleteInvestment = id => dispatch => {
    return InvestmentService.deleteInvestment(id)
        .then(
            () => {
                dispatch({
                    type: DELETE_INVESTMENT,
                    payload: {
                        id,
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
};
