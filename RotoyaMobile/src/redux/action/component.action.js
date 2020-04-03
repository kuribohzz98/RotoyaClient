import { ActionConstants } from '../../constants';

export const setOptionsGetSportCenters = (optionsGetSportCenters) => {
    return {
        type: ActionConstants.SET_OPTIONS_GET_SPORTCENTERS,
        optionsGetSportCenters
    }
}

export default {
    setOptionsGetSportCenters
}