import axios from 'axios';
import authHeader from './auth-header';
import {objectToQueryString} from "../helpers";

const API_URL = process.env.REACT_APP_API_URL + "/kyc";

class KYCService {
    fetchKYCs(params) {
        return axios.get(API_URL + '/list?' + objectToQueryString(params), {headers: authHeader()})
            .then(({data}) => data);
    }

    fetchKYCsCount() {
        return axios.get(API_URL + '/count', {headers: authHeader()})
            .then(({data}) => data);
    }

    fetchKYC(userID) {
        return axios.get(API_URL + '/single/' + userID, {headers: authHeader()})
            .then(({data}) => data);
    }

    newKYC(document) {
        return axios.post(API_URL + '/new', document, {headers: authHeader()})
            .then(({data}) => data);
    }

    editKYC(document) {
        return axios.post(API_URL + '/edit', document, {headers: authHeader()})
            .then(({data}) => data);
    }

    changeKYCStatus(id, status) {
        return axios.post(API_URL + '/change/status', {id, status}, {headers: authHeader()});
    }

    deleteKYC(userID, id) {
        return axios.post(API_URL + '/delete', {userID, id}, {headers: authHeader()});
    }
}

export default new KYCService();