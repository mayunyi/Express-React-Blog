/**
 * Created by mahai on 2018/11/27.
 */

import * as constants from './constants';

const defaultState = {
    login:false,
    register:false
};

export default ( state = defaultState, action) => {
    switch (action.type) {
        case constants.LOGIN_IN:
            return {...state, login:action.login};
        case constants.LOGIN_OUT:
            return {...state, login:action.login};
        case constants.LOGIN_REGISTER:
            return {...state, register:action.login};
        default :
            return state;
    }
};
