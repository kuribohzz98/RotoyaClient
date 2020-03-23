import { ActionConstants } from "../../constants";

const sportReducer = (state = {}, action) => {
    switch (action.type) {
        case ActionConstants.SET_SPORT_CENTER:
            return Object.assign({}, state, {
                sportCenters: action.sportCenters
            });

        case ActionConstants.ADD_SPORT_CENTER: {
            sportCentersNew = state.sportCenters.concat(action.sportCenters);
            return Object.assign({}, state, {
                sportCenters: sportCentersNew
            })
        }
    }
    return state;
}

export default sportReducer;