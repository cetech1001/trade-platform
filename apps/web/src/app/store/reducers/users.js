import {
    ADD_USER,
    CHANGE_USER_IMAGE,
    DELETE_USER,
    EDIT_USER,
    FETCH_USER,
    FETCH_USERS,
    FETCH_USERS_COUNT
} from "../actions/types";

const initialState = {
    list: [],
    currentUser: null,
    count: 0,
};

export default function usersReducer(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case FETCH_USERS:
            return {...state, count: payload.count, list: payload.users};
        case FETCH_USERS_COUNT:
            return {...state, count: payload.count};
        case FETCH_USER:
            return {...state, currentUser: payload.user};
        case ADD_USER:
            return {
                ...state,
                count: state.count ? state.count + 1 : 0,
                list: [payload.user, ...state.list]
            }
        case EDIT_USER:
            return {
                ...state,
                list: [...state.list].map(user => {
                    if (user.id === payload.user.id) {
                        return payload.user;
                    }
                    return user;
                }),
                currentUser: payload.user,
            }
        case CHANGE_USER_IMAGE:
            return {
                ...state,
                list: [...state.list].map(user => {
                    if (user.id === payload.user.id) {
                        return payload.user;
                    }
                    return user;
                }),
                currentUser: payload.user,
            }
        case DELETE_USER:
            return {
                count: state.count - 1,
                list: [...state.list].filter(user => user.id !== payload.id),
                currentUser: null,
            }
        default:
            return state;
    }
}