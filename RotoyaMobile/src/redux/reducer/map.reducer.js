import { EActionRedux } from '../../constants/actions.constants';

export const mapReducer = (state = {}, action) => {
    switch (action.type) {
        case EActionRedux.SET_LOCATION:
            return Object.assign({}, state, {
                location: action.location
            });
    }
    return state;
}