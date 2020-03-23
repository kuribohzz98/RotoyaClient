import { ActionConstants } from "../../constants";

const loginReducer = (state = {}, action) => {
    switch (action.type) {
        case ActionConstants.LOGIN:
            return Object.assign({}, state, {
                userId: action.user.id,
                username: action.user.username,
                firstName: action.user.userInfo.firstName,
                lastName: action.user.userInfo.lastName,
                phone: action.user.userInfo.phone,
                address: action.user.userInfo.address,
                email: action.user.userInfo.email,
                avatar: action.user.userMeta.avatar,
                gender: action.user.userInfo.gender
            });
    }
    return state;
}

export default loginReducer;