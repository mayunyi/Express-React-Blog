/**
 * Created by mahai on 2018/11/28.
 * 文章目录
 */

import React,{ Component } from "react";
import { Anchor } from 'antd';
const { Link } = Anchor;
export default class ArtliceMeun extends Component {
    constructor(props){
        super(props);
        this.state = {
            artliceMeum :[],    //文章目录
        }
    }

    shouldComponentUpdate (nextProps) {
        if(nextProps.articleContent && nextProps.articleContent != this.props.articleContent){
            const artlice = nextProps.articleContent;
            var result = artlice.match(/(<h2[^>]*>.*?<\/h2>)/ig);//文章里面的标题带<h2>之间的内容提取出来的表达是
            if(!result){
                result = []
            }
            this.state.artliceMeum = result;
            return true
        } else {
            return false
        }
    }



    handleClick = (e, link) => {
        e.preventDefault();
        console.log(link);
    };

    render() {
        const { artliceMeum } = this.state;
        return (
            <div className="Anchor">
                <Anchor affix={true} onClick={this.handleClick} offsetTop = {50} showInkInFixed = {false} bounds={10}>
                    <h1>目录</h1>
                    {
                        artliceMeum.map((item,index)=>{
                            let id = (/id=['"]([^'"]*?)['"]/ig.exec(item)||['',''])[1];     //抽取h2标签中id的属性值
                            return <Link href={`#${id}`} title={item.replace(/<[^>]+>/g,"")} key = {index}/>
                        })
                    }


                </Anchor>
            </div>
        );
    }
}
