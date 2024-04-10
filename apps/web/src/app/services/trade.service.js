import axios from 'axios';
import authHeader from './auth-header';
import {objectToQueryString} from "../helpers";

const API_URL = process.env.REACT_APP_API_URL + "/investments";

class TradeService {
    fetchInvestments(params) {
        return axios.get(
            API_URL + '/list?' + objectToQueryString(params),
            {headers: authHeader()}
        ).then(({data}) => data);
    }

    fetchInvestmentsCount(userID = '') {
        return axios.get(API_URL + '/count?userID=' + userID, {headers: authHeader()})
            .then(({data}) => data);
    }

    fetchInvestment(id) {
        return axios.get(API_URL + '/single/' + id, {headers: authHeader()})
            .then(({data}) => data);
    }

    duplicateInvestment(id) {
        return axios.get(API_URL + '/duplicate/' + id, {headers: authHeader()})
            .then(({data}) => data);
    }

    changeInvestmentStatus(id, status) {
        return axios.post(API_URL + '/change/status', {id, status}, {headers: authHeader()});
    }

    newInvestment(data) {
        return axios.post(API_URL + '/new', data, {headers: authHeader()})
            .then(({data}) => data);
    }

    pay(id) {
        return axios.get(API_URL + '/pay/' + id, {headers: authHeader()});
    }

    deleteInvestment(id) {
        return axios.get(API_URL + '/delete/' + id, {headers: authHeader()});
    }
}

export default new TradeService();
