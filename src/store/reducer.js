
import { combineReducers } from 'redux';

import { reducer as homeReducer } from '../home/store';
import { reducer as artliceListReducer } from '../artliceList/store';
import { reducer as loginReducer } from '../Login/store';

const reducer = combineReducers({
    home:homeReducer,
    articleList:artliceListReducer,
    login:loginReducer
});

export default reducer;
