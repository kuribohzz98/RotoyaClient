import axios from 'axios';
import { URL_API } from '../constants/api.constants';

export const setHeadersApi = {
    setAuthorization: function (access_token) {
        return {
            'Authorization': `Bearer ${access_token}`
        }
    },
    applicationJson: {
        'Content-Type': 'application/json'
    }
}

export const axiosBase = (headers) => {
    if (headers) {
        return axios.create({
            baseURL: URL_API,
            timeout: 5000,
            headers
        });
    }
    return axios.create({
        baseURL: URL_API,
        timeout: 5000,
    });
}