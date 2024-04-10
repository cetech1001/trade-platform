import axios from 'axios';
import authHeader from './auth-header';
import {objectToQueryString} from "../helpers";

const API_URL = process.env.REACT_APP_API_URL + "/payment/methods";

class PaymentMethodService {
    fetchPaymentMethods(params) {
        return axios.get(API_URL + '/list?' + objectToQueryString(params), {headers: authHeader()})
            .then(({data}) => data);
    }

    addPaymentMethod(paymentMethod) {
        return axios.post(API_URL + '/add', paymentMethod, {headers: authHeader()})
            .then(({data}) => data);
    }

    editPaymentMethod(paymentMethod) {
        return axios.post(API_URL + '/edit', paymentMethod, {headers: authHeader()})
            .then(({data}) => data);
    }

    deletePaymentMethod(id) {
        return axios.post(API_URL + '/delete', {id}, {headers: authHeader()})
    }
}

export default new PaymentMethodService();