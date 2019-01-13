/***
 * 文章管理
 */
import React, { Component } from 'react';
import {Table,Pagination,Divider,message} from 'antd'
import 'simplemde/dist/simplemde.min.css'
import {getUser} from '../../auth';
import ModifyArticles from './ModifyArticles';

const Fragment = React.Fragment;

export default class ArticleAdministration extends Component{
    constructor(props){
        super(props);
        this.state = {
            data :[],
            total:0,
            page:1,
            rows:20,
            artliceId:'',
            visible: false,
            artliceData:{},
            user:getUser(),
            isEdit:false
        };
        this.editorId = 'editor';
        this.smde = null;
        this.columns = [{
            title: '序号',
            dataIndex: 'NO',
            key: 'NO',
        }, {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },  {
            title: '点赞数量',
            dataIndex: 'upnum',
            key: 'upnum',
        }, {
            title: '留言数量',
            dataIndex: 'messnum',
            key: 'messnum',
        }, {
            title: '关注数量',
            dataIndex: 'likenum',
            key: 'likenum',
        },{
            title: '创建时间',
            dataIndex: 'creatTime',
            key: 'creatTime',
        },{
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={this.artliceEdit.bind(this,record)}>编辑</a>
                    <Divider type="vertical" />
                    <a href="javascript:;" onClick={this.artliceDelete.bind(this,record)}>删除</a>
                </span>
            ),
        }];
    }
    componentDidMount() {
        //获取当前页数所有文章
        this.getAllArticle(this.state.page,this.state.rows);

    }
    //编辑方法
    artliceEdit(value){
        this.setState({
            isEdit:true,
            artliceId:value.id
        })
    }

    //删除文章
    artliceDelete(value){
        const { user } = this.state;
        fetch(`/api/articlelist/delete/${value.id}`,{
            method:"DELETE",
            mode: "cors",
            headers: {
                "Authorization":user.token
            },
        }).then(rep=>{
            return rep.json();
        }).then(json=>{
            try{
                this.getAllArticle(this.state.page,this.state.rows);
                return message.success('操作成功')
            } catch(e){
                return message.error('操作失败')
            }
        })
    }

    getAllArticle(page,rows){
        const { user } = this.state;
        fetch(`/api/articlelist/user?page=${page}&rows=${rows}&userid=${user.userId}`,{
            headers: {
                "Authorization":user.token
            },
        }).then(rep=>{
            return rep.json();
        }).then(json=>{
            let articleData = json.data;
            articleData.sort((a,b)=>{
                return  Date.parse(b.date) - Date.parse(a.date)
            });
            let tableData = [];
            articleData.map((s,index)=>{
                tableData.push({
                    NO:index+1,
                    id:s._id,
                    title:s.Title,
                    messnum:s.messnum,
                    likenum:s.likenum,
                    upnum:s.upnum,
                    creatTime:s.date?s.date.substring(0,s.date.indexOf('T')):''
                })
            });
            this.setState({
                data:tableData,
                total:json.toatl
            })
        })
    }
    onChange = (page) =>{
        this.setState({
            page:page
        });
        this.getAllArticle(page)
    };
    CallBack(){
        this.setState({
            isEdit:false
        });
        this.getAllArticle(this.state.page,this.state.rows)
    };
    render () {
        return (
            <Fragment>
                {
                    this.state.isEdit ?
                        <ModifyArticles {...this.props} artliceId={this.state.artliceId} CallBack = {this.CallBack.bind(this)}/>
                        :
                        <Fragment>
                            <Table
                                columns={this.columns}
                                dataSource={this.state.data}
                                rowKey={record => record.NO}
                                pagination = {false}
                            />
                            <div style = {{paddingTop:20}}>
                                {
                                    this.state.total != 0 && <Pagination onChange={this.onChange} total={this.state.total} defaultPageSize={20} current={this.state.page}/>
                                }
                            </div>
                        </Fragment>
                }
            </Fragment>
        )
    }
}
