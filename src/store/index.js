/**
 * Created by mahai on 2018/10/10.
 * 总的store
 */

import { createStore, compose,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer,composeEnhancers(
    applyMiddleware( thunk )
));

export default store;