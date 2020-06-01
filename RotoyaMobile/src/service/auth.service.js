import { axiosBase } from './base.service';

const url = '/auth';

const loginService = async (data) => {
    return axiosBase.post(`${url}/login`, data);
}

const registerService = async (data) => {
    return axiosBase.post(`${url}/register`, data);
}

export default {
    loginService,
    registerService
}