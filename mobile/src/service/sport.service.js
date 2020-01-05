import { axiosBase } from './base.service';

export async function getSports() {
    return axiosBase().get('/sport/getAllSport');
}