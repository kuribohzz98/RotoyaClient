import { ActionConstants } from "../../constants";

const setLocationAction = (location) => {
    console.log(location);
    return {
        type: ActionConstants.SET_LOCATION,
        location
    }
}

export default {
    setLocationAction
}