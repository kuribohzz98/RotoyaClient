import { axiosBase } from './base.service';

export async function loginService(data) {
    return axiosBase().post('/auth/login', data);
}

export async function registerService(data) {
    return axiosBase().post('/auth/register', data);
}

export async function logoutService(data) {
    return axiosBase().post('/auth/logout', data);
}