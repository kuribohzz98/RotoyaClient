import { axiosBase } from './base.service';

export async function getSports() {
    return axiosBase().get('/sport/getAllSport');
}


// const optionsSportCenters = 

export async function getSportCenters(options) {
    return axiosBase().get('/sport/sportCenters', {
        params: options
    });
}

export async function getSportCenter(id, time) {
    return axiosBase().get(`/sport/sportCenter/${id}`, {
        params: { time }
    })
}