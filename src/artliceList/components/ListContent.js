/**
 * 文章列表组件
 * */

import React,{Component} from "react";
import { Pagination,Tag, Icon,Divider } from 'antd';
import { Link } from  'react-router-dom';
import '../styles/list.css'
export default class ListContent extends Component{
    constructor(props,context){
        super(props,context);
    }
    onChange = (page) =>{
        this.props.getList(page)
    };
    render() {

        return (
            <div className="articleList">
                {
                    this.props.articleList.map((item,index)=>{
                        return (
                            <div className="articleList-item"  key={index}>
                                <Link to={"/artile/"+item.articleId}>
                                    <h1 > {item.articleTitle}</h1>
                                </Link>
                                <div key={index}>
                                    <Icon type="calendar" theme="outlined" />
                                    {
                                        item.createdAt && <strong>{item.createdAt.substring(0,item.createdAt.indexOf('T'))}</strong>
                                    }

                                    {
                                        item.Marks && item.Marks.length>0 && <Icon type="tag" theme="outlined" />
                                    }
                                    {
                                        item.Marks.map((s,index)=>{
                                            return <Tag color="magenta" key = {index}>{s.markName}</Tag>
                                        })
                                    }
                                    <p className='articleListItem'>{item.articleContent}</p>
                                    <div style={{float:'right'}}>
                                        <Link to={"/artile/"+item.articleId}>阅读全文</Link>
                                    </div>
                                </div>
                                <Divider/>
                            </div>
                        )
                    })
                }
                <div className = 'page'>
                    {
                        this.props.pages != 0 && <Pagination  onChange={this.onChange} total={this.props.pages} defaultPageSize={20} current={this.props.articlePage}/>
                    }
                </div>
            </div>
        )
    }
}
