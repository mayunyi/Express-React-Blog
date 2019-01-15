/**
 * Created by mahai on 2019/1/5.
 * 文章留言信息
 */
import React,{Component} from 'react';
import {Icon,Input,Avatar,Divider,Pagination,Button,message} from 'antd';
const Fragment = React.Fragment;
import { getUser } from '../../auth'

export default class MessageArtlice extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            messageData:[],
            messagePage:0,         //接口的当前页
            messageToatl:0,     //留言的总数量
            page:1,
            pageCount:10,
            reply:'',       //判断是否回复 根基messageId
            messageConent:'',   //回复内容
            arlitceConent:'',
        }
    }

    componentDidMount(){
        this.setState({
            loading:true
        });
        let local = this.props.match.params.id;
        if(local){
            this.getMessage(local,this.state.page,this.state.pageCount)
        }
    }

    componentWillUnmount(){
        //组件卸载调用
        this.setState = (state,callback)=>{
            return;
        };
    }
    //获取该文章留言信息
    getMessage(articleID,page,rows){
        fetch(`/api/message/articlemessage?articleId=${articleID}&page=${page}&rows=${rows}`).then(rep=>{
            return rep.json();
        }).then(json=>{
            this.setState({
                messageData:json.data,
                messagePage:json.page,
                messageToatl:json.toatl
            })
        })
    }

    render() {
        const { messageData } = this.state;
        return(
            <Fragment>
                <div className="messageLayout">
                    <h2 style={{ marginLeft: 15}}>精彩评论</h2>
                    <ul>
                        {
                            messageData.map(s=>{
                                return (
                                    <li key={s._id}>
                                        <div className="Item">
                                            <Avatar shape="square" src={s.Avatar}/>
                                            <p className="messageUser">{s.messageuser}</p>
                                            <span className="time">{s.date.split('T')[0]}</span>
                                        </div>
                                        <div className="messageConnect">
                                            {s.content}
                                            <div style={{marginTop:10}}>
                                                <span style={{ marginRight: 20,cursor:'pointer'}} onClick={this._ChangeParentLike.bind(this,s._id)}>
                                                    <Icon type='like-o' style={{ marginRight: 8 }} />{s.like_num}
                                                </span>
                                                <span style={{ marginRight: 20 ,cursor:'pointer'}} onClick={this._ChangeMessage.bind(this,s._id)}>
                                                    <Icon type='message' style={{ marginRight: 8 }} />
                                                    {
                                                        this.state.reply !== s._id ? '回复' : '取消回复'
                                                    }
                                                </span>
                                                {
                                                    this.state.reply == s._id  && <div>
                                                        <Input placeholder={`回复${s.messageuser}`} style={{width:'60%'}} onChange = {this.InputText} value = {this.state.messageConent}/>
                                                        <Button style={{marginLeft:10}} type="primary" onClick={this._BottonReply.bind(this,s,s._id)}>发布</Button>
                                                    </div>
                                                }
                                            </div>
                                            <Divider dashed />
                                            {
                                                s.children.map(c=>{
                                                    return(
                                                        <div key = {c._id}>
                                                            <Avatar shape="square" src={c.Avatar} />
                                                            <p className="messageUser">{c.messageuser}</p>
                                                            <strong>{c.messageuserId === s.writerId?'(作者) 回复':'回复'}</strong>
                                                            <p className="messageUser">{c.to_name}</p>
                                                            <span className="time">{c.create_time.split('T')[0]}</span>
                                                            <div className="messageConnect">
                                                                {c.content}
                                                                <div style={{marginTop:10}}>
                                                                    <span style={{ marginRight: 20,cursor:'pointer'}} onClick={this._ChangeLike.bind(this,c._id)}>
                                                                        <Icon type='like-o' style={{ marginRight: 8 }} />{c.like_num}
                                                                    </span>
                                                                    <span style={{ marginRight: 20 ,cursor:'pointer'}} onClick={this._ChangeMessage.bind(this,c._id)}>
                                                                        <Icon type='message' style={{ marginRight: 8 }} />
                                                                        {
                                                                            this.state.reply !== c._id ? '回复' : '取消回复'
                                                                        }
                                                                    </span>
                                                                    {
                                                                        this.state.reply == c._id && <div>
                                                                            <Input placeholder={`回复${c.messageuser}`} style={{width:'60%'}} value = {this.state.messageConent} onChange = {this.InputText}/>
                                                                            <Button style={{marginLeft:10}} type="primary" onClick={this._BottonReply.bind(this,c,s._id)}>发布</Button>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div style={{padding:10}}>
                        <Pagination current={this.state.messagePage} total={this.state.messageToatl} onChange = {this.PaginationChange.bind(this)}/>
                    </div>
                    <div style={{padding:10}}>
                        <Avatar size="large" icon="user" />
                        <Input placeholder='评论文章' style={{width:'60%',marginLeft: 10}} value={this.state.arlitceConent} onChange = {this._InputArtlice}/>
                        <Button style={{marginLeft:10}} type="primary" onClick={this._BottonArtlice}>发送</Button>
                    </div>
                </div>
            </Fragment>
        );
    }

    // 分页查询方法
    PaginationChange(page, pageSize){
        let local = this.props.match.params.id;
        this.getMessage(local,page, pageSize)
        this.setState({
            page:page,
            pageCount:pageSize
        })
    }

    _BottonArtlice =() =>{
        if(!getUser().userId){
            return message.warning('登录后在评论！')
        }
        if(!this.state.arlitceConent){
            return message.warning('输入评论内容！')
        }
        let subData = {
            articleId:this.props.match.params.id,
            messageuser:getUser().userName,
            messageuserId:getUser().userId,
            Avatar:getUser().avatar,
            writerRead:'false',
            content:this.state.arlitceConent,
            extra_params:{},
            writerId:this.props.writerId
        };
        fetch(
            `/api/message/add`,
            {
                method:"POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":getUser().token
                },
                body:  JSON.stringify(subData)
            }
        ).then(rep=>{
            return rep.json()
        }).then(json=>{
            this.setState({
                arlitceConent:''
            });
            this.getMessage(this.props.match.params.id,this.state.page,this.state.pageCount)
        })
    };
    _InputArtlice =(e) =>{
        this.setState({
            arlitceConent:e.target.value
        })
    };
    //点赞 -> messageChildren接口 更新
    _ChangeLike (messageID){
        let local = this.props.match.params.id;
        fetch(
            `/api/messagechildren/likenum/${messageID}`,
            {
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":getUser().token
                }
            }
        ).then(rep=>{
            return rep.json();
        }).then(json=>{
            this.getMessage(local,this.state.page,this.state.pageCount)
        })
    }
    //父级点赞 -> messageChildren接口 更新
    _ChangeParentLike (messageID){
        let local = this.props.match.params.id;
        fetch(
            `/api/message/likenum/${messageID}`,
            {
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":getUser().token
                }
            }
        ).then(rep=>{
            return rep.json();
        }).then(json=>{
            this.getMessage(local,this.state.page,this.state.pageCount)
        })
    }
    //点赞 -> messageChildren接口 更新
    _ChangeMessage (id){
        if(id === this.state.reply){
            this.setState({
                reply:'',
                messageConent:''
            })
        } else {
            this.setState({
                reply:id,
                messageConent:''
            })
        }
    }

    InputText = (e) => {
        this.setState({
            messageConent:e.target.value
        })
    };
    //messageId 必须是最顶层的留言的id 即对文章评论的id
    _BottonReply(data,messageId){
        if(!getUser().userId){
            return message.warning('登录后在评论！')
        }
        if(!this.state.messageConent){
            return message.warning('输入评论内容！')
        }
        const { messageConent } = this.state;
        let local = this.props.match.params.id;
        let subData = {
            articleId:data.articleId,
            to_name:data.messageuser,
            to_id:data.messageuserId,
            Avatar:getUser().avatar,
            to_read:'false',
            content:messageConent,
            messageuserId:getUser().userId,
            messageuser:getUser().userName,
            messageId:messageId
        };
        fetch(
            `/api/messagechildren/add/`,
            {
                method:"POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":getUser().token
                },
                body:  JSON.stringify(subData)
            }
        ).then(rep=>{
            return rep.json()
        }).then(json=>{
            this.setState({
                reply:'',
                messageConent:''
            });
            this.getMessage(local,this.state.page,this.state.pageCount)
        })
    }
}