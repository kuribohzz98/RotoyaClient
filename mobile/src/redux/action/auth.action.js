import { EActionRedux } from '../../constants/actions.constants';

export const loginAction = (username) => {
    return {
        type: EActionRedux.LOGIN,
        username
    }
}