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
        userId: cookie('id'),
        userEmail: cookie('email'),
        identity: cookie('identity'),
        userName: cookie('name'),
        avatar:cookie('avatar'),
        token:cookie('token'),
    };
};

export const setUser = (id, email, identity, name,avatar,token) => {
    cookie('id', id);
    cookie('email', email);
    cookie('identity', identity);
    cookie('name', name);
    cookie('avatar', avatar);
    cookie('token', token);
};

export const clearUser = () => {
    cookie('id', null);
    cookie('email', null);
    cookie('identity', null);
    cookie('name', null);
    cookie('avatar', null);
    cookie('token', null);
};
