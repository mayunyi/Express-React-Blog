import React ,{ Component } from 'react';
import ArtileConent from './containers/ArtileConent'
import './styles/index.css';

const Fragment = React.Fragment;

export default class artileConent extends Component {


	constructor(props,context){
        super(props,context);
    }

    render() {
    	return (
	    	<Fragment>
	    		<ArtileConent {...this.props}/>
	    	</Fragment>
	    )
    }
}
