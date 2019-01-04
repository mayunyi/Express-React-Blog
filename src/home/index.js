import React,{ Component } from 'react';
import HomeIndex from './containers/HomeIndex';

const Fragment = React.Fragment;

export default class Home  extends Component {
    constructor(props,context){
        super(props,context);
    }

	render(){
		return (
			<Fragment>
                <HomeIndex/>
			</Fragment>
		)
	}

}

