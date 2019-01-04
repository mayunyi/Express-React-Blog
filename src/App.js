

import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';
import asyncComponent from './AsyncComponent';

const AsyncHome     = asyncComponent(() => import('./home'));
const AsyncAbout    = asyncComponent(() => import('./about'));
const AsyncAdmin    = asyncComponent(() => import('./admin'));
const AsyncArtileConent  = asyncComponent(() => import('./artileConent'));
// import artileConent from './artileConent'
const AsyncArtliceList  = asyncComponent(() => import('./artliceList'));
const AsyncPigeonhole  = asyncComponent(() => import('./pigeonhole'));
const AsyncLogin  = asyncComponent(() => import('./Login'));

//判断是pc端还是移动移动端
const isPC = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
const Fragment = React.Fragment;
class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Fragment>
                        <Route path='/' exact component={AsyncHome}/>

                        <Route path='/artile/:id' exact component={AsyncArtileConent}/>
                        {/*<Route path='/artile/:id' exact component={artileConent}/>*/}
                        <Route path='/artlicelist' exact component={AsyncArtliceList}/>
                        <Route path='/about' exact component={AsyncAbout}/>
                        <Route path='/admin' component={AsyncAdmin}/>
                        <Route path='/pigeonhole' exact component={AsyncPigeonhole}/>
                        <Route path='/login' exact component={AsyncLogin}/>
                    </Fragment>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;
