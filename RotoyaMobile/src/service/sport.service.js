import { axiosBase } from './base.service';

const url = '/sport'

const getSports = async () => {
    return axiosBase.get(`${url}`);
}

export default {
    getSports
}