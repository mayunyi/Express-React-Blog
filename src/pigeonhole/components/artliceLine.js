/**
 * Created by mahai on 2018/11/26.
 * 文章时间轴线
 */
import React, { Component } from 'react';
import { Timeline,Pagination  } from 'antd';
import {Link} from 'react-router-dom'
import '../styles/index.css'



export default class ArtliceLine extends Component {


    constructor(props,context){
        super(props,context);
        this.state ={
            allArtlice:[],
            total:0,
            page:1
        }
    }
    componentDidMount(){
        this.getAllArticle(this.state.page);
    }
    getAllArticle(value){
        fetch(`/blog/page/article/all/${value}`).then(rep=>{
            return rep.json();
        }).then(json=>{
            let articleData = json.res.rows;
            articleData.sort((a,b)=>{
                return  Date.parse(b.createdAt) - Date.parse(a.createdAt)
            });
            this.setState({
                allArtlice:articleData,
                total:json.res.count
            })
        })
    }
    onChange = (page) =>{
        this.setState({
            page:page
        });
        this.getAllArticle(page)
    };
    render(){
        let allArtlice = this.state.allArtlice;
        let TimeLine=[];
        let timeData=[];
        for(let i=0;i<allArtlice.length;i++){
            let time = allArtlice[i].createdAt?allArtlice[i].createdAt.split('T')[0]:'';
            if(timeData.indexOf(time) === -1){
                timeData.push(time)
            }
        }
        timeData.map((s,index)=>{
            if(s){
                TimeLine.push(
                    <Timeline.Item
                        key = {index}
                        color="green"
                    >
                        <h1 >{s}</h1>
                    </Timeline.Item>
                );
            }

            allArtlice.map(item=>{
                if(item.createdAt){
                    if(s === item.createdAt.split('T')[0]){
                        TimeLine.push(
                            <Timeline.Item key = {item.articleId}>
                                <Link to={`/artile/${item.articleId}`}>{item.articleTitle}</Link>
                            </Timeline.Item>
                        )
                    }
                } else {
                    TimeLine.push(
                        <Timeline.Item key = {item.articleId}>
                            <Link to={`/artile/${item.articleId}`}>{item.articleTitle}</Link>
                        </Timeline.Item>
                    )
                }
            })
        });
        return(
            <div className="articleConentLine">
                <div className='timelineCss'>
                    <Timeline
                        mode="alternate"
                        //reverse = {true}
                    >
                        <Timeline.Item>
                            OK! 目前共计 {this.state.total} 篇日志。 继续努力
                        </Timeline.Item>
                        {
                            TimeLine.map(s=>{
                                return s
                            })
                        }
                    </Timeline>
                </div>

                <div className="pageLine">
                    {
                        this.state.total != 0 && <Pagination onChange={this.onChange} total={this.state.total} defaultPageSize={20} current={this.state.page}/>
                    }
                </div>
            </div>
        )
    }
}
