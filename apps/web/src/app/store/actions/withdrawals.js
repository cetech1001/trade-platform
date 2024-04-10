import {
    CHANGE_WITHDRAWAL_STATUS,
    DELETE_WITHDRAWAL,
    DUPLICATE_WITHDRAWAL,
    FETCH_WITHDRAWALS,
    NEW_WITHDRAWAL
} from "./types";
import WithdrawalService from "../../services/withdrawal.service";
import {setMessage} from "./message";

export const fetchWithdrawals = (params) => dispatch => {
    return WithdrawalService.fetchWithdrawals(params)
        .then(
            ({withdrawals, count}) => {
                dispatch({
                    type: FETCH_WITHDRAWALS,
                    payload: {
                        withdrawals,
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

export const fetchWithdrawalsCount = (userID = '') => dispatch => {
    return WithdrawalService.fetchWithdrawalsCount(userID)
        .then(
            ({count}) => {
                dispatch({
                    type: FETCH_WITHDRAWALS,
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

export const duplicateWithdrawal = (id) => dispatch => {
    return WithdrawalService.duplicateWithdrawal(id)
        .then(
            withdrawal => {
                dispatch({
                    type: DUPLICATE_WITHDRAWAL,
                    payload: {
                        withdrawal,
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

export const changeWithdrawalStatus = (id, status, txID = null) => dispatch => {
    return WithdrawalService.changeWithdrawalStatus(id, status, txID)
        .then(
            withdrawal => {
                dispatch({
                    type: CHANGE_WITHDRAWAL_STATUS,
                    payload: {
                        withdrawal,
                    },
                });
                dispatch(setMessage({
                    message: 'Withdrawal ' + status,
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

export const newWithdrawal = data => dispatch => {
    return WithdrawalService.newWithdrawal(data)
        .then(
            withdrawal => {
                dispatch({
                    type: NEW_WITHDRAWAL,
                    payload: {
                        withdrawal,
                    },
                });
                dispatch(setMessage({
                    show: true,
                    type: 'success',
                    message: 'New withdrawal request submitted',
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

export const deleteWithdrawal = id => dispatch => {
    return WithdrawalService.deleteWithdrawal(id)
        .then(
            () => {
                dispatch({
                    type: DELETE_WITHDRAWAL,
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
