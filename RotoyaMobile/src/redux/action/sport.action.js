import { EActionRedux } from '../../constants/actions.constants';

export const setSportCentersAction = (sportCenters) => {
    return {
        type: EActionRedux.SET_SPORT_CENTER,
        sportCenters
    }
}

export const addSportCenters = (sportCenters) => {
    return {
        type: EActionRedux.ADD_SPORT_CENTER,
        sportCenters
    }
}