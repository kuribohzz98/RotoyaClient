import { StorageService } from '../../service';
import { StorageConstants, ActionConstants } from '../../constants';

const loginAction = (user) => { 
    return {
        type: ActionConstants.LOGIN,
        user
    }
}

const logoutAction = () => {
    StorageService.removeItem(StorageConstants.AccessToken);
    return {
        type: ActionConstants.LOGOUT
    }
}

export default {
    loginAction,
    logoutAction
}