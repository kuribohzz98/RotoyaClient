import { EActionRedux } from '../../constants/actions.constants';

export const componentReducer = (state = {} , action) => {

    switch (action.type) {
        case EActionRedux.SET_SHOW_FILTER_HOME:
            return Object.assign({}, state, {
                showFilterHome: action.showFilterHome
            });
            
        case EActionRedux.SET_OPTIONS_GET_SPORTCENTERS:
            return Object.assign({}, state, {
                optionsGetSportCenters: action.optionsGetSportCenters
            })
    }
    return state;
}