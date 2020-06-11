import { axiosBase } from './base.service';

const url = '/auth';

const loginService = async (data) => {
    return axiosBase.post(`${url}/login`, data);
}

const registerService = async (data) => {
    return axiosBase.post(`${url}/register`, data);
}

const forgetPassword = async data => {
    return axiosBase.post(`${url}/forget-password`, data);
}

export default {
    loginService,
    registerService,
    forgetPassword
}