import { StorageService } from '../../service';
import { ActionConstants } from '../../constants';

const loginAction = (user) => { 
    return {
        type: ActionConstants.LOGIN,
        user
    }
}

const logoutAction = () => {
    StorageService.clear();
    return {
        type: ActionConstants.LOGOUT
    }
}

export default {
    loginAction,
    logoutAction
}