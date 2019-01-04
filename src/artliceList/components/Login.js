/**
 * 登录组件
 * */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {actionCreators} from '../store';

const Fragment = React.Fragment;

const { loginIn,loginOut }  = actionCreators;

@connect(
    state =>({...state.articleList}),
    { loginIn, loginOut }
)
 export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <Fragment>
                登录页面
            </Fragment>
        )
    }

 }