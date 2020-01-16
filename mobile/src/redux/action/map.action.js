import { EActionRedux } from '../../constants/actions.constants';

export const setLocationAction = (location) => {
    console.log(location);
    return {
        type: EActionRedux.SET_LOCATION,
        location
    }
}