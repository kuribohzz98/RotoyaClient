import { axiosBase } from './base.service';

const url = '/sport-center'

const getSportCenters = async (options) => {
    return axiosBase.get(`${url}`, { params: options });
}

const getSportCenter = async (id, time) => {
    return axiosBase.get(`${url}/${id}`, {
        params: { time }
    })
}

export default {
    getSportCenters,
    getSportCenter
}