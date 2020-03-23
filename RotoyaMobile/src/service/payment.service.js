import { axiosBase } from "./base.service";

const url = '/payment';

const atmInland = async (body) => {
    return axiosBase.post(`${url}/atm-inland`, body);
}

const paymentMomo = async (body) => {
    return axiosBase.post(`${url}/momo`, body);
}

const getPayment = async (params) => {
    return axiosBase.get(`${url}/get-one`, { params })
}

export default {
    atmInland,
    paymentMomo,
    getPayment
}