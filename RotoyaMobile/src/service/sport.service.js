import { axiosBase } from './base.service';

const url = '/sport'

const getSports = async () => {
    return axiosBase.get(`${url}/getAllSport`);
}

const getSportCenters = async (options) => {
    return axiosBase.get(`${url}/sportCenters`, {
        params: options
    });
}

const getSportCenter = async (id, time) => {
    return axiosBase.get(`${url}/sportCenter/${id}`, {
        params: { time }
    })
}

export default {
    getSports,
    getSportCenters,
    getSportCenter
}