/**
 * Created by mahai on 2018/11/27.
 */


import React,{Component} from "react";
import Login from './components/Login'

export default class artileList extends  Component {
    constructor(props,context){
        super(props,context);
    }
    render() {
        return (
            <Login {...this.props}/>
        )
    }
}
