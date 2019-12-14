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

async function axiosBase(method, url, data, headers) {
    return axios({
        method,
        url,
        data,
        headers
    })
}

export async function loginService(data) {
    return axiosBase('POST',`${URL_API}/auth/login`, data)
    // return axios.post(`${URL_API}/auth/login`, data);
}
