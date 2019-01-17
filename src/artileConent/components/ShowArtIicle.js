import React,{Component} from 'react';
import marked from 'marked'
import hljs from 'highlight.js'
import {Row,Col,Icon,BackTop,Spin,message} from 'antd';
import MessageArtlice from "./MessageArtlice";
import { getUser } from '../../auth'

const Fragment = React.Fragment;


export default class ShowArticle extends Component {

	constructor(props,context){
        super(props,context);
        this.state = {
            title:'',
            writer:'',
            writerId:'',
            data:'',
            articleContent:'',
            marks:[],
            loading:false,
            isZan:false,    //判断登录用户对这边文章有没有点赞
            zanId:''
        }
    }
    componentDidMount(){
	    this.setState({
            loading:true
        });
        let local = this.props.match.params.id;
        if(local){
            this.getIdArticle(local);
            if(getUser().userId){
                this.getArtliceZan(getUser().userId,local)
            }
        }
        marked.setOptions({
            highlight: code => hljs.highlightAuto(code).value,
        });
    }
    //获取用户对文章是是否点赞
    getArtliceZan(userId,artliceId){
        const token = getUser().token;
        fetch(
            `/api/zan/change/?upuserId=${userId}&articleId=${artliceId}`,
            {
                method:"GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":token
                }
            }
        ).then(rep=>{
            return rep.json();
        }).then(json=>{
            if(typeof json=='object'){
                this.setState({
                    isZan:true,
                    zanId:json._id
                })
            } else {
                this.setState({
                    isZan:false
                })
            }
        })
    }
    //获取文章
    getIdArticle(articleID){
        fetch(`/api/articlelist/${articleID}`).then(rep=>{
            return rep.json();
        }).then(json=>{
            if(json.status === 2){
                this.setState({
                    title:json.data.Title,
                    writer:json.data.writer,
                    data:json.data.date ? json.data.date.substring(0,json.data.date.indexOf('T')):'',
                    articleContent:json.data.content,
                    marks:json.data.tags,
                    writerId:json.data.writerId,
                    loading:false
                })
            } else {
                message.error('获取文章失败');
                this.setState({
                    loading:false
                })
            }

        })
    }

    render() {
        const  spin = {
            textAlign: 'center',
            padding: '30px 50px',
            margin: '20px 0'
        };
        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div style={spin}>
                            <Spin spinning={this.state.loading} size='large' tip="数据加载中..."/>
                        </div>
                        :
                        <Fragment>
                            {/*<ArtliceMeun {...this.props} articleContent = {marked(this.state.articleContent) }/>*/}
                            <div className="articleConent">
                                <Row>
                                    <Col>
                                        <h1 className="title">{this.state.title}</h1>
                                    </Col>
                                </Row>
                                <div style = {{textAlign:'center'}}>
                                    <label>作者:</label>
                                    <strong className="data">{this.state.writer}</strong>
                                </div>
                                <div style = {{textAlign:'center'}}>
                                    <Icon type="calendar" theme="outlined" />
                                    <strong className="data">{this.state.data}</strong>
                                </div>
                                <div className='articleShow' dangerouslySetInnerHTML={{ __html: marked(this.state.articleContent)}}/>
                            </div>
                            <div className="btnZan" onClick={this.BtnZan}>
                                <span
                                    className={this.state.isZan?"text YizanText":"text zanText"}
                                >
                                    {this.state.isZan?'已赞':'赞'}
                                </span>
                            </div>
                            <MessageArtlice {...this.props} writerId = {this.state.writerId}/>
                            <BackTop visibilityHeight = {50}/>
                        </Fragment>
                }
            </Fragment>

    	)
    }

    BtnZan = () =>{
        if(!getUser().userId){
            return message.warning('登录后在赞！')
        }
        if(this.state.isZan){
            fetch(`/api/zan/unzan/${this.state.zanId}`,{
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Authorization": getUser().token
                }
            }).then(rep=>{
                return rep.json()
            }).then(json =>{
                if(json.status){
                    this.setState({
                        zanId:'',
                        isZan:false
                    });
                    message.success(json.msg)
                } else {
                    message.success(json.msg)
                }
            })

        } else {
            let subData = {
                articleId: this.props.match.params.id,
                upuser: getUser().userName,
                upuserId: getUser().userId
            };
            fetch('/api/zan/add', {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": getUser().token
                },
                body: JSON.stringify(subData)
            }).then(rep => {
                return rep.json()
            }).then(json => {
                if (typeof json == 'object') {
                    this.setState({
                        zanId:json._id,
                        isZan:true
                    });
                    message.success('成功！')
                } else {
                    message.error(json)
                }
            })
        }
    }
}

