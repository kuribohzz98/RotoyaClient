import { axiosBase } from "./base.service"

const url = '/booking';

const bookingSportCenter = async (path) => {
    return axiosBase.post(`${url}/bookSportGround`, path);
}

const rollbackBooking = async (body) => {
    return axiosBase.post(`${url}/roll-back`, body)
}

export default {
    rollbackBooking,
    bookingSportCenter
}