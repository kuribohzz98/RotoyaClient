import { axiosBase } from './base.service';

const url = '/sport-ground'

const getSportGround = async (id, time) => {
    return axiosBase.get(`${url}/info/${id}`, { params: { time } });
}

export default {
    getSportGround
}