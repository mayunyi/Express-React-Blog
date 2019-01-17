/**
 * Created by mahai on 2018/11/26.
 * 文章时间轴线
 */
import React, { Component } from 'react';
import { Timeline,Pagination ,message } from 'antd';
import {Link} from 'react-router-dom'
import '../styles/index.css'
import { getUser } from '../../auth'



export default class ArtliceLine extends Component {


    constructor(props,context){
        super(props,context);
        this.user = getUser();
        this.state ={
            allArtlice:[],
            total:0,
            page:1,
            rows:20
        }
    }
    componentDidMount(){
        const { page, rows } = this.state;
        this.getAllArticle(page,rows);
    }
    getAllArticle(page,rows){
        if(!this.user.userId){
            return message.warning('请登录！')
        }
        fetch(
            `/api/articlelist/user?page=${page}&rows=${rows}&userid=${this.user.userId}&state=1`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Authorization": this.user.token
                },
            }
        ).then(rep=>{
            return rep.json();
        }).then(json=>{
            let articleData = json.data;
            articleData.sort((a,b)=>{
                return  Date.parse(b.date) - Date.parse(a.date)
            });
            this.setState({
                allArtlice:articleData,
                total:json.toatl
            })
        })
    }
    onChange = (page) =>{
        this.setState({
            page:page
        });
        this.getAllArticle(page,this.state.rows)
    };
    render(){
        let allArtlice = this.state.allArtlice;
        let TimeLine=[];
        let timeData=[];
        for(let i=0;i<allArtlice.length;i++){
            let time = allArtlice[i].date ? allArtlice[i].date.split('T')[0]:'';
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
                if(item.date){
                    if(s === item.date.split('T')[0]){
                        TimeLine.push(
                            <Timeline.Item key = {item._id}>
                                <Link to={`/artile/${item._id}`}>{item.Title}</Link>
                            </Timeline.Item>
                        )
                    }
                } else {
                    TimeLine.push(
                        <Timeline.Item key = {item._id}>
                            <Link to={`/artile/${item._id}`}>{item.Title}</Link>
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
                        this.state.total != 0 && <Pagination onChange={this.onChange} total={this.state.total} defaultPageSize={this.state.rows} current={this.state.page}/>
                    }
                </div>
            </div>
        )
    }
}
