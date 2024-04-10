import {CHANGE_KYC_STATUS, DELETE_KYC, EDIT_KYC, FETCH_DOCUMENT, FETCH_DOCUMENTS, NEW_KYC} from "./types";
import KYCService from "../../services/kyc.service";
import {setMessage} from "./message";

export const fetchKYCs = (params) => dispatch => {
    return KYCService.fetchKYCs(params)
        .then(
            ({documents, count}) => {
                dispatch({
                    type: FETCH_DOCUMENTS,
                    payload: {
                        documents,
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

export const fetchKYC = (userID) => dispatch => {
    return KYCService.fetchKYC(userID)
        .then(
            document => {
                dispatch({
                    type: FETCH_DOCUMENT,
                    payload: {
                        document,
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

export const newKYC = (document) => dispatch => {
    return KYCService.newKYC(document)
        .then(
            document => {
                dispatch({
                    type: NEW_KYC,
                    payload: {
                        document
                    },
                });
                dispatch(setMessage({
                    message: 'KYC submitted',
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

export const editKYC = (document) => dispatch => {
    return KYCService.editKYC(document)
        .then(
            document => {
                dispatch({
                    type: EDIT_KYC,
                    payload: {
                        document,
                    },
                });
                dispatch(setMessage({
                    message: 'KYC modified',
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

export const changeKYCStatus = (id, status) => dispatch => {
    return KYCService.changeKYCStatus(id, status)
        .then(
            () => {
                dispatch({
                    type: CHANGE_KYC_STATUS,
                    payload: {
                        id,
                        status
                    },
                });
                dispatch(setMessage({
                    message: 'KYC ' + status,
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

export const deleteKYC = (userID, id) => dispatch => {
    return KYCService.deleteKYC(userID, id)
        .then(
            () => {
                dispatch({
                    type: DELETE_KYC,
                    payload: {
                        id,
                    },
                });
                dispatch(setMessage({
                    message: 'KYC deleted',
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