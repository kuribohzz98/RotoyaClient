import { ActionConstants } from "../../constants";

const mapReducer = (state = {}, action) => {
    switch (action.type) {
        case ActionConstants.SET_LOCATION:
            return Object.assign({}, state, {
                location: action.location
            });
    }
    return state;
}

export default mapReducer;