import axios from 'axios';
import authHeader from './auth-header';
import {objectToQueryString} from "../helpers";

const API_URL = process.env.REACT_APP_API_URL + "/referrals";

class ReferralService {
    fetchReferrals(params) {
        return axios.get(API_URL + '/list?' + objectToQueryString(params), {headers: authHeader()})
            .then(({data}) => data);
    }

    fetchReferralsCount(id) {
        return axios.get(API_URL + '/count?id=' + id, {headers: authHeader()})
            .then(({data}) => data);
    }

    fetchReferrer(id) {
        return axios.get(API_URL + '/single?id=' + id, {headers: authHeader()})
            .then(({data}) => data);
    }

    fetchReferralBonuses(params) {
        return axios.get(API_URL + '/bonuses?' + objectToQueryString(params), {headers: authHeader()})
            .then(({data}) => data);
    }
}

export default new ReferralService();