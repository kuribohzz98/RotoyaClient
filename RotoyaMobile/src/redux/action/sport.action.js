import { ActionConstants } from "../../constants"

const setSportCentersAction = sportCenters => {
    return {
        type: ActionConstants.SET_SPORT_CENTER,
        sportCenters
    }
}

const addSportCenters = sportCenters => {
    return {
        type: ActionConstants.ADD_SPORT_CENTER,
        sportCenters
    }
}

export default {
    setSportCentersAction,
    addSportCenters
}