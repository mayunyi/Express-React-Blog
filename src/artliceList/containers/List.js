import React,{Component} from "react";
import {connect} from 'react-redux';
import {actionCreators} from '../store';
import ListContent from '../components/ListContent'

import FunListArtlice from '../components/FunListArtlice'
const {getList} = actionCreators;
const Fragment = React.Fragment;

@connect(
    state =>({...state.articleList}),
    {getList}
)
export default class List extends Component{
    constructor(props,context){
        super(props,context);
    }
    componentDidMount(){
        this.props.getList(1);
    }
    render() {
        return (
            <Fragment>
                {/*<ListContent {...this.props}/>*/}
                <FunListArtlice {...this.props}/>
            </Fragment>
        )
    }
}
