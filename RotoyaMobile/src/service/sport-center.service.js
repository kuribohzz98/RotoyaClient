import { axiosBase } from './base.service';
import { StorageService } from '.';
import { StorageConstants } from '../constants';

const url = '/sport-center'

const getSportCenters = async (options) => {
    return axiosBase.get(`${url}`, { params: options });
}

const getSportCenter = async (id, time) => {
    return axiosBase.get(`${url}/${id}`, {
        params: { time }
    })
}

const getSportCenterFavorites = async (options = {}) => {
    const userId = await StorageService.getItem(StorageConstants.UserId);
    return axiosBase.get(`${url}/favorites/${+userId}`, {
        params: options
    })
}

export default {
    getSportCenters,
    getSportCenter,
    getSportCenterFavorites
}