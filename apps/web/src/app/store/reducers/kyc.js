import {
    CHANGE_KYC_STATUS,
    DELETE_KYC,
    EDIT_KYC,
    FETCH_DOCUMENT,
    FETCH_DOCUMENTS,
    NEW_KYC
} from "../actions/types";

const initialState = {
    documents: [],
    count: 0,
    currentDocument: null,
};

export default function kycReducer(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case FETCH_DOCUMENTS:
            return {...state, count: payload.count, documents: payload.documents};
        case FETCH_DOCUMENT:
            return {
                ...state,
                currentDocument: payload.document,
            };
        case NEW_KYC:
            return {
                ...state,
                currentDocument: payload.document,
            };
        case CHANGE_KYC_STATUS:
            return {
                ...state,
                documents: [...state.documents].map(document => {
                    if (parseInt(document.id) === parseInt(payload.id)) {
                        return {...document, status: payload.status};
                    }
                    return document;
                }),
            };
        case EDIT_KYC:
            return {
                ...state,
                currentDocument: payload.document,
                documents: [...state.documents].map(document => {
                    if (parseInt(document.id) === parseInt(payload.document.id)) {
                        return payload.document;
                    }
                    return document;
                }),
            };
        case DELETE_KYC:
            return {
                count: state.count - 1,
                currentDocument: null,
                documents: [...state.documents]
                    .filter(document => parseInt(document.id) !== parseInt(payload.id)),
            };
        default:
            return state;
    }
}