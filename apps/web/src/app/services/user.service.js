import axios from 'axios';
import authHeader from './auth-header';
import {objectToQueryString} from "../helpers";

const API_URL = process.env.REACT_APP_API_URL + "/users";

class UserService {
    fetchUsers(params) {
        return axios.get(API_URL + '/list?' + objectToQueryString(params), {headers: authHeader()})
            .then(({data}) => data);
    }

    fetchUsersCount() {
        return axios.get(API_URL + '/count', {headers: authHeader()})
            .then(({data}) => data);
    }

    fetchUser(id) {
        return axios.get(API_URL + '/single/' + id, {headers: authHeader()})
            .then(({data}) => data);
    }

    refreshUserData() {
        return axios.get(API_URL + '/refresh', {headers: authHeader()})
            .then(({data}) => data);
    }

    addUser(user) {
        return axios.post(API_URL + '/add', user, {headers: authHeader()})
            .then(({data}) => data);
    }

    editUser(user) {
        return axios.post(API_URL + '/edit', user, {headers: authHeader()})
            .then(({data}) => data);
    }

    changeImage(user) {
        return axios.post(API_URL + '/change/image', user, {headers: authHeader()})
            .then(({data}) => data);
    }

    deleteUser(id) {
        return axios.post(API_URL + '/delete', {id}, {headers: authHeader()})
    }
}

export default new UserService();