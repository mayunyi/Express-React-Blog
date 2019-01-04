/***
 * 标签管理
 */
import React,{Component} from "react";
import {Table,Tabs ,Divider,Modal,Input,Spin,message,Button} from 'antd'
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
            addTag:''
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
        if(this.state.tabsKey === '1'){
            this.getAllTags()
        }
    }
    //删除标签
    tagDelete(value){
        this.setState({
            spinning:true
        });
        fetch(`/blog/mark/${value.id}`,{
            method:"DELETE",
            mode: "cors",
            credentials: 'include',
        }).then(rep=>{
            return rep.json()
        }).then(json=>{
            if(json.res === 1){
                this.getAllTags();
                this.setState({
                    spinning:false
                });
                return message.success('删除标签成功！')
            } else {
                return message.error('删除标签失败！')
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
            markName:this.state.editValue.tag
        };
        fetch(`/blog/mark/${this.state.editValue.id}/${this.state.editValue.tag}`,{
            method:"PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(subData)
        }).then(rep=>{
            return rep.json()
        }).then(json=>{
            this.getAllTags();
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
    //获取所以得标签
    getAllTags(){
        if(!this.state.spinning){
            this.setState({
                spinning:true
            });
        }
        fetch('/blog/mark/all').then(rep=>{
            return rep.json();
        }).then(json=>{
            let allTag = [];
            for (let i =0;i<json.length;i++){
                allTag.push({
                    id:json[i].markId,
                    NO:i+1,
                    tag:json[i].markName,
                    creatTime:json[i].createdAt.substring(0,json[i].createdAt.indexOf('T'))
                })
            }
            this.setState({
                tagTable:allTag,
                spinning:false
            })
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
        if (this.state.addTag.indexOf('/')!= -1){
            return message.error('不能含有/斜杠字段！')
        } else if(!this.state.addTag){
            return message.error('空值不能添加！')
        } else {
            // let formData = new FormData();
            // formData.append("markName",this.state.addTag);
            let data = {
                markName :this.state.addTag
            };
            fetch(`/blog/mark/markName/${this.state.addTag}`,{
                method:"POST",
                mode: "cors",
                // body: formData,
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(data)
            }).then(rep=>{
                return rep.json();
            }).then(json=>{
                if(json.res){
                    this.getAllTags();
                    //创建成功后清空input的值
                    this.setState({
                        addTag:''
                    });
                    return message.success('创建标签成功！')
                } else {
                    return message.success('创建标签失败！')
                }
            })
        }
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
