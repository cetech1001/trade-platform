import {ADD_PAYMENT_METHOD, DELETE_PAYMENT_METHOD, EDIT_PAYMENT_METHOD, FETCH_PAYMENT_METHODS} from "./types";
import PaymentMethodService from "../../services/payment-method.service";
import {setMessage} from "./message";

export const fetchPaymentMethods = (params = {}) => dispatch => {
    return PaymentMethodService.fetchPaymentMethods(params)
        .then(
            ({paymentMethods, count}) => {
                dispatch({
                    type: FETCH_PAYMENT_METHODS,
                    payload: {
                        paymentMethods,
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

export const addPaymentMethod = paymentMethod => dispatch => {
    return PaymentMethodService.addPaymentMethod(paymentMethod)
        .then(
            paymentMethod => {
                dispatch({
                    type: ADD_PAYMENT_METHOD,
                    payload: {
                        paymentMethod,
                    }
                });
                dispatch(setMessage({
                    message: 'Payment Method added successfully',
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

export const editPaymentMethod = paymentMethod => dispatch => {
    return PaymentMethodService.editPaymentMethod(paymentMethod)
        .then(
            paymentMethod => {
                dispatch({
                    type: EDIT_PAYMENT_METHOD,
                    payload: {
                        paymentMethod,
                    }
                });
                dispatch(setMessage({
                    message: 'Payment Method modified successfully',
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

export const deletePaymentMethod = id => dispatch => {
    return PaymentMethodService.deletePaymentMethod(id)
        .then(
            () => {
                dispatch({
                    type: DELETE_PAYMENT_METHOD,
                    payload: {
                        id,
                    }
                });
                dispatch(setMessage({
                    message: 'Payment Method deleted successfully',
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