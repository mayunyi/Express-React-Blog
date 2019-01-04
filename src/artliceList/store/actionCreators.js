
import * as constants from './constants'
const getArtliceList = (result) =>({
    type: constants.GET_ARTLICE_LIST,
    articleList:result.articleList,
    articlePage:result.articlePage,
    pages:result.pages
});

export const getList = (page = 1) =>{
    return (dispatch) => {
        fetch(constants.ARTLICELIST+page,{
            method:"get",
            mode: "cors",
            headers:{
                "Access-Control-Allow-Origin": "*",
            }
        }).then(res=>{
            return res.json();
        }).then(json=>{
            const data ={
                articleList:json.res.rows,
                articlePage:page,
                pages:json.res.count
            };
            dispatch(getArtliceList( data ))
        }).catch((e)=>{
            console.log('error',e)
        })
    }
};
