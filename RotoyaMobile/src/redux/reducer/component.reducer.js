import { ActionConstants } from '../../constants';

const componentReducer = (state = {} , action) => {

    switch (action.type) {       
        case ActionConstants.SET_OPTIONS_GET_SPORTCENTERS:
            return Object.assign({}, state, {
                optionsGetSportCenters: action.optionsGetSportCenters
            })

        case ActionConstants.SEARCH_SPORT_CENTER:
            return Object.assign({}, state, {
                name: action.name
            })

        case ActionConstants.SET_IS_VISIBLE_FILTER:
            return Object.assign({}, state, {
                isVisibleFilter: action.isVisibleFilter
            })
    }
    return state;
}

export default componentReducer;