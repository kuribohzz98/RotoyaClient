import { EActionRedux } from '../../constants/actions.constants';
import { removeItem } from '../../service/storage.service';
import { StorageConstants } from '../../constants/storage.constants';

export const loginAction = (user) => { 
    return {
        type: EActionRedux.LOGIN,
        user
    }
}

export const logoutAction = () => {
    removeItem(StorageConstants.ACCESS_TOKEN);
    return {
        type: EActionRedux.LOGOUT
    }
}