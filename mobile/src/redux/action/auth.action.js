import { EActionRedux } from '../../constants/actions.constants';
import { removeItem } from '../../service/storage.service'

export const loginAction = (username) => {
    return {
        type: EActionRedux.LOGIN,
        username
    }
}

export const logoutAction = () => {
    removeItem(StorageConstants.ACCESS_TOKEN);
    return {
        type: EActionRedux.LOGOUT
    }
}