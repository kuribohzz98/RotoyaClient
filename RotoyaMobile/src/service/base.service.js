import axios from 'axios';
import { ApiConstants } from '../constants';

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

export const axiosBase = axios.create(ApiConstants.optionsBaseAxios);

export const axiosBaseHeader = (headers) => {
    return axios.create({
        ...ApiConstants.optionsBaseAxios,
        headers
    });
}