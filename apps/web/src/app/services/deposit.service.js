import axios from 'axios';
import authHeader from './auth-header';
import {objectToQueryString} from "../helpers";

const API_URL = process.env.REACT_APP_API_URL + "/deposits";

class DepositService {
    fetchDeposits(params) {
        return axios.get(API_URL + '/list?' + objectToQueryString(params), {headers: authHeader()})
            .then(({data}) => data);
    }

    fetchDepositsCount(userID = '') {
        return axios.get(API_URL + '/count?userID=' + userID, {headers: authHeader()})
            .then(({data}) => data);
    }

    duplicateDeposit(id) {
        return axios.get(API_URL + '/duplicate/' + id, {headers: authHeader()})
            .then(({data}) => data);
    }

    changeDepositStatus(id, status) {
        return axios.post(API_URL + '/change/status', {id, status}, {headers: authHeader()});
    }

    newDeposit(data) {
        return axios.post(API_URL + '/new', data, {headers: authHeader()})
            .then(({data}) => data);
    }

    deleteDeposit(id) {
        return axios.get(API_URL + '/delete/' + id, {headers: authHeader()});
    }
}

export default new DepositService();
