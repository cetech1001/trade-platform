import axios from 'axios';
import authHeader from './auth-header';
import {objectToQueryString} from "../helpers";

const API_URL = process.env.REACT_APP_API_URL + "/plans";

class PairService {
    fetchPlans(params) {
        return axios.get(API_URL + '/list?' + objectToQueryString(params), {headers: authHeader()})
            .then(({data}) => data);
    }

    addPlan(plan) {
        return axios.post(API_URL + '/add', plan, {headers: authHeader()})
            .then(({data}) => data);
    }

    editPlan(plan) {
        return axios.post(API_URL + '/edit', plan, {headers: authHeader()})
            .then(({data}) => data);
    }

    deletePlan(id) {
        return axios.post(API_URL + '/delete', {id}, {headers: authHeader()})
    }
}

export default new PairService();
