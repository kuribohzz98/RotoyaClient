import { ActionConstants } from '../../constants';

const setOptionsGetSportCenters = (optionsGetSportCenters) => {
    return {
        type: ActionConstants.SET_OPTIONS_GET_SPORTCENTERS,
        optionsGetSportCenters
    }
}

export default {
    setOptionsGetSportCenters
}