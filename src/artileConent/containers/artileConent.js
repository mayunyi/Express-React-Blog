import React,{Component} from 'react';
import ShowArticle from '../components/ShowArtIicle';
import HeaderComponent from '../../_component/Header';

const Fragment = React.Fragment;
export default class ArtileConent extends  Component {

	constructor(props,context){
        super(props,context);
    }

    render() {
    	return (
    		<Fragment>
                <HeaderComponent {...this.props}/>
    			<ShowArticle {...this.props}/>
    		</Fragment>
    	)

    }
}
























