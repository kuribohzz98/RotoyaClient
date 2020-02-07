import { EActionRedux } from '../../constants/actions.constants';

export const sportReducer = (state = {}, action) => {

    switch (action.type) {
        case EActionRedux.SET_SPORT_CENTER:
            return Object.assign({}, state, {
                sportCenters: action.sportCenters
            });
    }
    return state;
}