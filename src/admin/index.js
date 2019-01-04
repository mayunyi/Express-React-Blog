import React ,{ Component } from 'react';
import AdminLayout from './containers/AdminLayout'
const Fragment = React.Fragment;

export default class Admin extends Component {


    constructor(props,context){
        super(props,context);
    }

    render() {
        return (
            <Fragment>
                <AdminLayout {...this.props}/>
            </Fragment>
        )
    }
}
