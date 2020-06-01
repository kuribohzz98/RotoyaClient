import { axiosBase } from './base.service';

const url = '/image';

export async function getImage(path) {
    return axiosBase.get(url, { params: { path } });
} 

export async function getMultipleImageSportCenter(paths) {
    return axiosBase.get(`${url}/multiple`, { params: { paths } })
}