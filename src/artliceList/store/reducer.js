import * as constants from './constants';

const defaultState = {
    articleList:[],
    articlePage:1,
    pages:0,
};



export default ( state = defaultState, action) => {

    switch (action.type) {
        case constants.GET_ARTLICE_LIST:
            return {...state, pages:action.pages, articleList:action.articleList, articlePage:action.articlePage};
        default :
            return state;
    }
};



