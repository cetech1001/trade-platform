import {FETCH_REFERRAL_BONUSES, FETCH_REFERRALS, FETCH_REFERRALS_COUNT, FETCH_REFERRER} from "./types";
import ReferralService from "../../services/referral.service";
import {setMessage} from "./message";

export const fetchReferrals = (params) => dispatch => {
    return ReferralService.fetchReferrals(params)
        .then(
            ({referrals, count}) => {
                dispatch({
                    type: FETCH_REFERRALS,
                    payload: {
                        referrals,
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

export const fetchReferralsCount = (id) => dispatch => {
    return ReferralService.fetchReferralsCount(id)
        .then(
            ({count}) => {
                dispatch({
                    type: FETCH_REFERRALS_COUNT,
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

export const fetchReferrer = (id) => dispatch => {
    return ReferralService.fetchReferrer(id)
        .then(
            referrer => {
                dispatch({
                    type: FETCH_REFERRER,
                    payload: {
                        referrer,
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

export const fetchReferralBonuses = (params) => dispatch => {
    return ReferralService.fetchReferralBonuses(params)
        .then(
            ({bonuses, count}) => {
                dispatch({
                    type: FETCH_REFERRAL_BONUSES,
                    payload: {
                        bonuses,
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