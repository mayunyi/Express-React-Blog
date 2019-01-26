import React,{ Component } from 'react';
import HeaderComponent from '../_component/Header';
import ResumePage from './component/RemusePage'
const Fragment = React.Fragment;

export default class Resume  extends Component {

    constructor(props) {
        super(props);
        this.state={
        }
    }


    render(){


        return (
            <Fragment>
                <HeaderComponent {...this.props}/>
                <ResumePage {...this.props}/>
            </Fragment>
        )
    }

}
