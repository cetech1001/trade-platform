import {
    CHANGE_DEPOSIT_STATUS,
    DUPLICATE_DEPOSIT,
    FETCH_DEPOSITS,
    NEW_DEPOSIT,
    DELETE_DEPOSIT,
    FETCH_DEPOSITS_COUNT
} from "./types";
import DepositService from "../../services/deposit.service";
import {setMessage} from "./message";

export const fetchDeposits = (params) => dispatch => {
    return DepositService.fetchDeposits(params)
        .then(
            ({deposits, count}) => {
                dispatch({
                    type: FETCH_DEPOSITS,
                    payload: {
                        deposits,
                        count
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

export const fetchDepositsCount = (userID = '') => dispatch => {
    return DepositService.fetchDepositsCount(userID)
        .then(
            ({ count }) => {
                dispatch({
                    type: FETCH_DEPOSITS_COUNT,
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

export const duplicateDeposit = (id) => dispatch => {
    return DepositService.duplicateDeposit(id)
        .then(
            deposit => {
                dispatch({
                    type: DUPLICATE_DEPOSIT,
                    payload: {
                        deposit,
                    },
                });
                dispatch(setMessage({
                    message: 'Deposit duplicated',
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

export const changeDepositStatus = (id, status) => dispatch => {
    return DepositService.changeDepositStatus(id, status)
        .then(
            () => {
                dispatch({
                    type: CHANGE_DEPOSIT_STATUS,
                    payload: {
                        id,
                        status
                    },
                });
                dispatch(setMessage({
                    message: 'Deposit ' + status,
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

export const newDeposit = data => dispatch => {
    return DepositService.newDeposit(data)
        .then(
            deposit => {
                dispatch({
                    type: NEW_DEPOSIT,
                    payload: {
                        deposit,
                    },
                });
                dispatch(setMessage({
                    show: true,
                    type: 'success',
                    message: 'New deposit submitted',
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

export const deleteDeposit = id => dispatch => {
    return DepositService.deleteDeposit(id)
        .then(
            () => {
                dispatch({
                    type: DELETE_DEPOSIT,
                    payload: {
                        id,
                    },
                });
                dispatch(setMessage({
                    message: 'Deposit deleted',
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
};
