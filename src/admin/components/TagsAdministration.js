/***
 * 标签管理
 */
import React,{Component} from "react";
import {Table,Tabs ,Divider,Modal,Input,Spin,message,Button} from 'antd';
import {getUser} from '../../auth'
import '../styles/tags.css'
const TabPane = Tabs.TabPane;
export default class TagsAdministration extends Component{
    constructor(props,context){
        super(props,context);
        this.state = {
            tagTable:[],
            tabsKey:'1',
            visible: false,
            editValue:{},
            spinning:false,
            addTag:'',
            page:1,
            rows:20,
            total:0,
            pagination:{}
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'NO',
            key: 'NO',
        }, {
            title: '标签',
            dataIndex: 'tag',
            key: 'tag',
        }, {
            title: '创建时间',
            dataIndex: 'creatTime',
            key: 'creatTime',
        },{
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
        },{
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={this.tagEdit.bind(this,record)}>编辑</a>
                    <Divider type="vertical" />
                    <a href="javascript:;" onClick={this.tagDelete.bind(this,record)}>删除</a>
                </span>
            ),
        }];
    }
    componentDidMount(){
        const {page,rows} = this.state;
        if(this.state.tabsKey === '1'){
            this.getAllTags(page,rows)
        }
    }
    //删除标签
    tagDelete(value){
        const userInfo = getUser();
        if(!userInfo.userId){
            message.error('请登录账号！')
        }
        this.setState({
            spinning:true
        });
        fetch(`/api/tags/delete/${value.id}`,{
            method:"DELETE",
            mode: "cors",
            headers:{
                "Authorization":userInfo.token
            }
        }).then(rep=>{
            return rep.json()
        }).then(json=>{
            if(json.status){
                //查找第一页的数据
                this.getAllTags(1,this.state.rows);
                this.setState({
                    spinning:false
                });
                return message.success(json.msg)
            } else {
                return message.error(json.msg)
            }

        })
    }

    //编辑方法
    tagEdit(value){
        this.setState({
            visible: true,
            editValue:value
        });
    }

    //提交修改的标签并关闭对话框
    handleOk = (e) => {
        let subData = {
            tag:this.state.editValue.tag,
            userId:getUser().userId
        };
        fetch(`/api/tags/edit/${this.state.editValue.id}`,{
            method:"POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization":getUser().token
            },
            body:JSON.stringify(subData)
        }).then(rep=>{
            return rep.json()
        }).then(json=>{
            this.getAllTags(this.state.page,this.state.rows);
            this.setState({
                visible: false,
            });
            return message.success('修改标签成功！')
        })

    };

    //关闭对话框
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    //获取用户当前页数的标签标签
    getAllTags(page,rows){
        if(!this.state.spinning){
            this.setState({
                spinning:true
            });
        }
        const userInfo = getUser();
        if(!userInfo.userId){
            message.error('请登录账号！')
        }

        fetch(
            `/api/tags/find?page=${page}&rows=${rows}&userId=${userInfo.userId}`,
            {
                mode: "cors",
                headers:{
                    "Authorization":userInfo.token
                }
            }
        ).then(rep=>{
            return rep.json();
        }).then(json=>{
            let allTag = [];
            switch (json.status){
                case 1://查询不到
                    this.setState({
                        tagTable:allTag,
                        spinning:false,
                        page:page,
                        rows:rows,
                    });
                    return message.error(json.msg);
                case 2:     //成功状态
                    for (let i =0;i<json.data.length;i++){
                        allTag.push({
                            id:json.data[i]._id,
                            NO:i+1,
                            tag:json.data[i].tag,
                            creatTime:json.data[i].createTime.substring(0,json.data[i].createTime.indexOf('T')),
                            updateTime:json.data[i].updateTime.substring(0,json.data[i].updateTime.indexOf('T')),
                        })
                    }
                    this.setState({
                        tagTable:allTag,
                        spinning:false,
                        total:json.total,
                        page:page,
                        rows:rows,
                    });
                    break;
                case 0://接口失败
                    this.setState({
                        tagTable:allTag,
                        spinning:false,
                        page:page,
                        rows:rows,
                    });
                    return message.error(json.msg);
                default:
                    this.setState({
                        tagTable:allTag,
                        spinning:false,
                        page:page,
                        rows:rows,
                    });
                    return message.error('获取失败！');
            }


        })
    }


    changeTabs = (value) =>{

    };


    //获取修改标签的名称
    patchTag(e){
        let values = {...this.state.editValue,tag:e.target.value};
        this.setState({
            editValue:values
        })
    }

    //获取用户输入的值
    onAddTag = (e)=>{
        let value = e.target.value;
        this.setState({
            addTag:value
        })
    };

    //提交用户创建标签的值
    onSubmitAddTag=()=>{
        const {page,rows} = this.state;
        const user = getUser();
        if(!user.userId){
            message.error('请登录账号！')
        }
        if (this.state.addTag.indexOf('/')!= -1){
            return message.error('不能含有/斜杠字段！')
        } else if(!this.state.addTag){
            return message.error('空值不能添加！')
        } else {
            let data = {
                tag :this.state.addTag,
                userId:user.userId
            };
            fetch(`/api/tags/add/`,{
                method:"POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":user.token
                },
                body:JSON.stringify(data)
            }).then(rep=>{
                return rep.json();
            }).then(json=>{
                if(typeof json === 'object'){
                    this.getAllTags(page,rows);
                    //创建成功后清空input的值
                    this.setState({
                        addTag:''
                    });
                    return message.success('创建标签成功！')
                }else {
                    return message.success('创建标签失败！')
                }
            })
        }
    };

    //点击分页的标签数据
    handleTableChange = (pagination) => {
        this.getAllTags(pagination.current,pagination.pageSize)
    };
    render(){
        return(
            <div>
                <Spin tip="玩命的获取数据..." spinning = {this.state.spinning}>
                    <div className="addTag">
                        <label>新增标签:</label>
                        <Input placeholder="请输入您要添加的标签后点击添加按钮" value={this.state.addTag} onChange = {this.onAddTag}/>
                        <Button onClick={this.onSubmitAddTag}>添加</Button>
                    </div>
                    <Tabs value = {this.state.tabsKey} onChange={this.changeTabs}>
                        <TabPane tab="所有标签标签" key="1">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.tagTable}
                                rowKey={record => record.NO}
                                pagination={{
                                    current: this.state.page,
                                    pageSize: this.state.rows,
                                    total: this.state.total
                                }}
                                onChange={this.handleTableChange}
                            />
                        </TabPane>
                    </Tabs>
                    <Modal
                        title='修改标签名称'
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <label>标签:</label>
                        <Input
                            value={this.state.editValue.tag}
                            placeholder="请输入标签名称"
                            onChange={this.patchTag.bind(this)}
                        />
                    </Modal>
                </Spin>
            </div>

        )
    }
}
