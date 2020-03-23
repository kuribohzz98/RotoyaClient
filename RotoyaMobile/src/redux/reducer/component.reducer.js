import { ActionConstants } from '../../constants';

const componentReducer = (state = {} , action) => {

    switch (action.type) {       
        case ActionConstants.SET_OPTIONS_GET_SPORTCENTERS:
            return Object.assign({}, state, {
                optionsGetSportCenters: action.optionsGetSportCenters
            })
    }
    return state;
}

export default componentReducer;