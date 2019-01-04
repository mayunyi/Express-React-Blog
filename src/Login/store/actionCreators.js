/**
 * Created by mahai on 2018/11/27.
 */
import * as constants from './constants';

//登录
export const loginIn = (result) =>({
    type: constants.LOGIN_IN,
    login:result
});


//登出
export const loginOut = (result) =>({
    type: constants.LOGIN_OUT,
    login:result
});

//注册
export const loginRegister = (result) =>({
    type: constants.LOGIN_REGISTER,
    register:result
});


