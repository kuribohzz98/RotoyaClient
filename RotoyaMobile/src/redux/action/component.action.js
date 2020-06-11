import { ActionConstants } from '../../constants';

const setOptionsGetSportCenters = (optionsGetSportCenters) => {
    return {
        type: ActionConstants.SET_OPTIONS_GET_SPORTCENTERS,
        optionsGetSportCenters
    }
}

const setNameSearchSportCenters = name => {
    return {
        type: ActionConstants.SEARCH_SPORT_CENTER,
        name
    }
}

const setNameSearchSportCentersEpic = name => {
    return {
        type: ActionConstants.SEARCH_SPORT_CENTER_EPIC,
        name
    }
}

const setIsVisibleFilter = isVisibleFilter => {
    return {
        type: ActionConstants.SET_IS_VISIBLE_FILTER,
        isVisibleFilter
    }
}

export default {
    setOptionsGetSportCenters,
    setNameSearchSportCenters,
    setNameSearchSportCentersEpic,
    setIsVisibleFilter
}