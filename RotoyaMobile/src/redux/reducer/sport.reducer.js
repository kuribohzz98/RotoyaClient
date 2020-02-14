import { EActionRedux } from '../../constants/actions.constants';

export const sportReducer = (state = {}, action) => {

    switch (action.type) {
        case EActionRedux.SET_SPORT_CENTER:
            return Object.assign({}, state, {
                sportCenters: action.sportCenters
            });

        case EActionRedux.ADD_SPORT_CENTER:
            const sportCentersNew = state.sportCenters.concat(action.sportCenters);
            return Object.assign({}, state, {
                sportCenters: sportCentersNew
            })
    }
    return state;
}