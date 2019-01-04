/***
 * 文章管理
 */
import React, { Component } from 'react';
import {Table,Pagination,Divider,message} from 'antd'
import 'simplemde/dist/simplemde.min.css'
import {getUser} from '../../auth';
import ModifyArticles from './ModifyArticles'

const Fragment = React.Fragment;

export default class ArticleAdministration extends Component{
    constructor(props){
        super(props);
        this.state = {
            data :[],
            total:0,
            page:1,
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
        }, {
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
        this.getAllArticle(this.state.page);

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
        fetch(`/blog/iarticle/${value.id}`,{
            method:"DELETE",
            mode: "cors",
            //credentials: 'include',
        }).then(rep=>{
            return rep.json();
        }).then(json=>{
            if(json.res === 1){
                this.getAllArticle(this.state.page);
                return message.success('操作成功')
            } else {
                return message.error('操作失败')
            }
        })
    }

    getAllArticle(value){
        fetch(`/blog/page/article/all/${value}`).then(rep=>{
            return rep.json();
        }).then(json=>{
            let articleData = json.res.rows;
            articleData.sort((a,b)=>{
                return  Date.parse(b.createdAt) - Date.parse(a.createdAt)
            });
            let tableData = [];
            articleData.map((s,index)=>{
                tableData.push({
                    NO:index+1,
                    id:s.articleId,
                    title:s.articleTitle,
                    creatTime:s.createdAt?s.createdAt.substring(0,s.createdAt.indexOf('T')):''
                })
            });
            this.setState({
                data:tableData,
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
    CallBack(){
        this.setState({
            isEdit:false
        });
        this.getAllArticle(this.state.page)
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
