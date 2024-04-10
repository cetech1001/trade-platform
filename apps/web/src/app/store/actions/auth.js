import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
} from "./types";

import AuthService from "../../services/auth.service";
import {setMessage} from "./message";

export const register = (user) => (dispatch) => {
    return AuthService.register(user).then(
        (response) => {
            dispatch({
                type: REGISTER_SUCCESS,
            });

            dispatch(setMessage({
                message: response.data.message,
                type: 'success',
                show: true
            }));

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: REGISTER_FAIL,
            });

            dispatch(setMessage({
                message,
                type: 'danger',
                show: true
            }));

            return Promise.reject();
        }
    );
};

export const login = (username, password) => (dispatch) => {
    return AuthService.login(username, password).then(
        user => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: { user },
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

            dispatch({
                type: LOGIN_FAIL,
            });

            dispatch(setMessage({
                message,
                type: 'danger',
                show: true
            }));

            return Promise.reject();
        }
    );
};

export const logout = () => (dispatch) => {
    AuthService.logout();

    dispatch({
        type: LOGOUT,
    });
};

export const resetPassword = (username) => (dispatch) => {
    return AuthService.resetPassword(username)
        .then(
            () => {
                dispatch(setMessage({
                    message: 'New password has been sent to your email address',
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

                dispatch({
                    type: LOGIN_FAIL,
                });

                dispatch(setMessage({
                    message,
                    type: 'danger',
                    show: true
                }));

                return Promise.reject();
            }
        )
}