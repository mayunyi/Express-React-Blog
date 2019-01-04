import * as constants from './constants';

const defaultState = {
    articleList:[],
    page:1,
    toatl:0,
};



export default ( state = defaultState, action) => {

    switch (action.type) {
        case constants.GET_ARTLICE_LIST:
            return {...state, toatl:action.toatl, articleList:action.articleList, page:action.page};
        default :
            return state;
    }
};



