import { EActionRedux } from '../../constants/actions.constants';

export const loginReducer = (state = { username: ''}, action) => {
    switch (action.type) {
        case EActionRedux.LOGIN:
            return Object.assign({}, state, {
                username: action.username
            });
    }

    return state;
}

export const logoutReducer = (state, action) => {
    switch (action.type) {
        case EActionRedux.LOGOUT:
            return;
    }
}
