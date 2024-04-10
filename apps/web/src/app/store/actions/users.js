import {
    ADD_USER,
    CHANGE_USER_IMAGE,
    DELETE_USER,
    EDIT_USER,
    FETCH_USER,
    FETCH_USERS, FETCH_USERS_COUNT,
    LOGIN_FAIL,
    LOGIN_SUCCESS
} from "./types";
import UserService from "../../services/user.service";
import {setMessage} from "./message";

export const fetchUsers = (params) => dispatch => {
    return UserService.fetchUsers(params)
        .then(
            ({users, count}) => {
                dispatch({
                    type: FETCH_USERS,
                    payload: {
                        users,
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

export const fetchUsersCount = () => dispatch => {
    return UserService.fetchUsersCount()
        .then(
            ({ count }) => {
                dispatch({
                    type: FETCH_USERS_COUNT,
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

export const fetchUser = id => dispatch => {
    return UserService.fetchUser(id)
        .then(
            user => {
                dispatch({
                    type: FETCH_USER,
                    payload: {
                        user,
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

export const refreshUserData = () => dispatch => {
    return UserService.refreshUserData()
        .then(
            user => {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {
                        user,
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
}

export const addUser = user => dispatch => {
    return UserService.addUser(user)
        .then(
            user => {
                dispatch({
                    type: ADD_USER,
                    payload: {
                        user,
                    }
                });
                dispatch(setMessage({
                    message: 'User added successfully',
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

export const editUser = user => dispatch => {
    return UserService.editUser(user)
        .then(
            user => {
                dispatch({
                    type: EDIT_USER,
                    payload: {
                        user,
                    }
                });
                dispatch(setMessage({
                    message: 'User profile modified successfully',
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

export const deleteUser = id => dispatch => {
    return UserService.deleteUser(id)
        .then(
            () => {
                dispatch({
                    type: DELETE_USER,
                    payload: {
                        id,
                    }
                });
                dispatch(setMessage({
                    message: 'User deleted successfully',
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

export const changeUserImage = data => dispatch => {
    return UserService.changeImage(data)
        .then(
            user => {
                dispatch({
                    type: CHANGE_USER_IMAGE,
                    payload: {
                        user,
                    }
                });
                return Promise.resolve();
            },
            error => {
                console.log('Error Action');
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