import axios from 'axios';
import authHeader from './auth-header';
import {objectToQueryString} from "../helpers";

const API_URL = process.env.REACT_APP_API_URL + "/withdrawals";

class WithdrawalService {
    fetchWithdrawals(params) {
        return axios.get(API_URL + '/list?' + objectToQueryString(params), {headers: authHeader()})
            .then(({data}) => data);
    }

    fetchWithdrawalsCount(userID = '') {
        return axios.get(API_URL + '/count?userID=' + userID, {headers: authHeader()})
            .then(({data}) => data);
    }

    duplicateWithdrawal(id) {
        return axios.get(API_URL + '/duplicate/' + id, {headers: authHeader()})
            .then(({data}) => data);
    }

    changeWithdrawalStatus(id, status, txID) {
        return axios.post(API_URL + '/change/status', {id, status, txID}, {headers: authHeader()})
            .then(({data}) => data);
    }

    newWithdrawal(data) {
        return axios.post(API_URL + '/new', data, {headers: authHeader()})
            .then(({data}) => data);
    }

    deleteWithdrawal(id) {
        return axios.get(API_URL + '/delete/' + id, {headers: authHeader()});
    }
}

export default new WithdrawalService();
