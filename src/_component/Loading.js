/**
 * Created by mahai on 2018/11/29.
 */

import React,{ Component } from "react";
import './styles/loading.css'
const Fragment = React.Fragment;

export default class Loading extends  Component {


    render() {
        return (
            <Fragment>
                <div className="table y100 bg-red">
                    <div className="h1 mt2 mb0">LOADING</div>
                    <div className='square'></div>
                    <div className='square'></div>
                    <div className='square'></div>
                    <div className='square'></div>
                    <div className='square'></div>
                    <div className='square'></div>
                    <div className='square'></div>
                    <div className='square'></div>
                    <div className='square'></div>
                    <div className='square'></div>
                </div>
            </Fragment>
        )
    }
}