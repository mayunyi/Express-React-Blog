
import * as constants from './constants'
const changeHomeData = (result) =>({
    type: constants.CHANGE_HOME_DATA,
    topicList:result.topicList,
    articleList:result.articleList,
    recommendList:result.recommendList,
});
const addHomeList = (list,nextPage) =>({
    type: constants.ADD_ARTICLE_LIST,
    list:list,
    nextPage
});

export const toggleTopShow = (value) =>({
    type: constants.TOGGLE_SCROLL_TOP,
    value
});
