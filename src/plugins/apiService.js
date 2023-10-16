import axios from 'axios';
import store from '@/store'

const customAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout: 60000,
});

const requestHandler = request => {
    let accessToken = store.state.auth.accessToken;
    request.headers.Authorization = 'Bearer ' + accessToken;
    return request;
};

const responseHandler = response => {
    if (response.status == 401) {
        store.dispatch('auth/logout')
    }
    return response;
};

const errorHandler = error => {
    if (error.response.status == 401) {
        store.dispatch('auth/logoutIfToken')
    }
    return Promise.reject(error);
};

customAxios.interceptors.request.use(
    (request) => requestHandler(request),
    (error) => errorHandler(error)
);

customAxios.interceptors.response.use(
    (response) => responseHandler(response),
    (error) => errorHandler(error)
);

export default customAxios;