/**
 * Created by mahai on 2018/11/26.
 */
import React, { Component } from 'react';
import HeaderComponent from '../../_component/Header'
import ArtliceLine from '../components/artliceLine'

const Fragment = React.Fragment;
export default class File extends Component {


    constructor(props,context){
        super(props,context);
    }

    render() {
        return (
            <Fragment>
                <HeaderComponent {...this.props}/>
                <ArtliceLine {...this.props}/>
            </Fragment>
        )
    }
}

