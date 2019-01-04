/**
 * Created by mahai on 2018/11/26.
 * 归档模块
 */

import React, { Component } from 'react';
import File from './containers/file';

const Fragment = React.Fragment;
export default class Pigeonhole extends Component {


    constructor(props,context){
        super(props,context);
    }

    render() {
        return (
            <Fragment>
                <File {...this.props}/>
            </Fragment>
        )
    }
}


