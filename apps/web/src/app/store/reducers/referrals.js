import {
    FETCH_REFERRAL_BONUSES,
    FETCH_REFERRALS,
    FETCH_REFERRALS_COUNT,
    FETCH_REFERRER
} from "../actions/types";

const initialState = {
    list: [],
    bonuses: [],
    refCount: 0,
    bonusCount: 0,
    referrer: null,
};

export default function referralsReducer(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case FETCH_REFERRALS:
            return {...state, refCount: payload.count, list: payload.referrals};
        case FETCH_REFERRALS_COUNT:
            return {...state, refCount: payload.count};
        case FETCH_REFERRER:
            return {...state, referrer: payload.referrer};
        case FETCH_REFERRAL_BONUSES:
            return {...state, bonusCount: payload.count, bonuses: payload.bonuses};
        default:
            return state;
    }
}