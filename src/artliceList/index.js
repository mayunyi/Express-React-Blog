

import React,{Component} from "react";
import HeaderComponent from '../_component/Header';
import List from "./containers/List";

const Fragment = React.Fragment;
export default class artileList extends  Component {
	constructor(props,context){
        super(props,context);
    }
    render() {
	    return (
	        <Fragment>
	            <HeaderComponent {...this.props}/>
	            <List {...this.props}/>
	        </Fragment>
	    )
	}
}
