import axios from 'axios';
import authHeader from './auth-header';
import {objectToQueryString} from "../helpers";

const API_URL = process.env.REACT_APP_API_URL + "/support/tickets";

class SupportTicketService {
    fetchSupportTickets(params) {
        return axios.get(API_URL + '/list?' + objectToQueryString(params), {headers: authHeader()})
            .then(({data}) => data);
    }

    fetchSupportTicketsCount(params = {}) {
        return axios.get(API_URL + '/count?' + objectToQueryString(params), {headers: authHeader()})
            .then(({data}) => data);
    }

    changeSupportTicketStatus(id, status) {
        return axios.post(API_URL + '/change/status', {id, status}, {headers: authHeader()});
    }

    newSupportTicket(data) {
        return axios.post(API_URL + '/new', data, {headers: authHeader()})
            .then(({data}) => data);
    }
}

export default new SupportTicketService();