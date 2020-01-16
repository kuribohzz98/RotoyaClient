import { EActionRedux } from '../../constants/actions.constants';

export const componentReducer = (state = {}, action) => {

    switch (action.type) {
        case EActionRedux.SET_SHOW_FILTER_HOME:
            return Object.assign({}, state, {
                showFilterHome: action.showFilterHome
            });
    }
    return state;
}