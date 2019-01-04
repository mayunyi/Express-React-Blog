/**
 * Created by mm on 2018/9/12.
 */

import cookie from 'component-cookie';
export default () => {
    let id = cookie('id');
    return !!id;
};

export const getUser = () => {
    return {
        userName: cookie('userName'),
        userId: cookie('userId'),
        userAccount: cookie('userAccount'),
        userPhone: cookie('userPhone'),
        userPicture:cookie('userPicture'),
        userMail:cookie('userMail')
    };
};

export const setUser = (userName, userId, userAccount, userPhone,userPicture,userMail) => {
    cookie('userName', userName);
    cookie('userId', userId);
    cookie('userAccount', userAccount);
    cookie('userPhone', userPhone);
    cookie('userPicture', userPicture);
    cookie('userMail', userMail);
};

export const clearUser = () => {
    cookie('userName', null);
    cookie('userId', null);
    cookie('userAccount', null);
    cookie('userPhone', null);
    cookie('userPicture', null);
    cookie('userMail', null);
};
