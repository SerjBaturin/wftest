import Axios from "axios";

export const api = Axios.create({ baseURL: '/api'});
const onFulfilled = response => response;
const onRejected = error => {
    const reason = Axios.isCancel(error) ? new Error('Abort Request') : error;
    return Promise.reject(reason);
};

api.interceptors.response.use(onFulfilled, onRejected);

export const webDCApiUrl = 'https://ws.estvis.com';

export { Axios }
