import { axiosBase } from './base.service';

const url = '/sport-center-favorite';

const deleteFavorite = async (id) => {
    return axiosBase.delete(`${url}/${id}`);
}

const create = async (userId, sportCenterId) => {
    return axiosBase.post(`${url}`, { userId, sportCenterId });
}

export default {
    deleteFavorite,
    create
}