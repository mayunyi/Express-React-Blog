
import * as constants from './constants'
const getArtliceList = (result) =>({
    type: constants.GET_ARTLICE_LIST,
    articleList:result.articleList,
    page:result.page,
    toatl:result.toatl
});

export const getList = (page = 1,rows = 20) =>{
    return (dispatch) => {
        fetch(`${constants.ARTLICELIST}?page=${page}&rows=${rows}`,{
            method:"get",
            mode: "cors",
            // headers:{
            //     "Access-Control-Allow-Origin": "*",
            // }
        }).then(res=>{
            return res.json();
        }).then(json=>{
            const data ={
                articleList:json.data,
                page:page,
                toatl:json.toatl
            };
            dispatch(getArtliceList( data ))
        }).catch((e)=>{
            console.log('error',e)
        })
    }
};
