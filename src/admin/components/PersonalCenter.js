/**
 * Created by mahai on 2018/12/10.
 */
import React,{Component} from "react";
import {getUser} from '../../auth';
import '../styles/personcenter.css';
import {Row, Col,Input,Form,Spin,Button,Upload,Icon,message,Modal} from 'antd';

// const Fragment = React.Fragment;
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 20}
};
const UPImgLayout = {
    labelCol: {span: 2},
    wrapperCol: {span: 22}
};
class PersonalCenter extends  Component {

    constructor(props){
        super(props);
        this.state = {
            isEdit:false,
            loading:false,
            isDisabled:true,
            iconLoading:false,
            imgDataUrl:'',         //上传附件的数据
            previewVisible:false,

            userPhone:getUser().userPhone+11111,
            userMail:getUser().userMail,
            userAccount:getUser().userAccount
        }
    }

    componentDidMount(){
        let userId = getUser().userId;
    }



    render() {
        const { getFieldDecorator } = this.props.form;
        const { isEdit, loading, isDisabled, imgDataUrl, previewVisible } = this.state;

        const upAction = {
            action: '/blog/upload/img',
            headers: {
                'method':"POST",
                'mode': "cors",
                "Access-Control-Allow-Origin":'*'
            }
        };

        const upImg = (
            <Col>
                <FormItem
                    {...UPImgLayout}
                    label="头像上传"
                >
                    {getFieldDecorator('imgFile', {

                    })(
                        <Upload
                            listType="picture-card"
                            beforeUpload={this.beforeUpload}
                            onChange={this.imgChange.bind(this)}
                            onPreview={this.handlePreview}
                            onRemove = {this.imgRemove}
                            {...upAction}
                        >
                            {
                                imgDataUrl ?
                                    null
                                    :
                                    <div>
                                        <Icon type={this.state.iconLoading ? 'loading' : 'plus'}  />
                                        <div className="ant-upload-text">上传图片</div>
                                    </div>
                            }

                        </Upload>
                    )}

                </FormItem>
            </Col>
        );
        const imgData= (
            <Col>
                <FormItem>
                    {getFieldDecorator('img', {
                    })(
                        <div className="imgDiv">
                            <img src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                        </div>
                    )}
                </FormItem>
            </Col>
        );



        return (
            <Spin tip="修改中..." spinning={loading}>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        {
                            isEdit ? upImg : imgData
                        }
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="电话"
                            >
                                {getFieldDecorator('phone', {
                                    initialValue:this.state.userPhone,
                                    rules: [
                                        {
                                            required: !isDisabled, message: '电话必填!',
                                        },{
                                            validator: this.checkValidator
                                        }
                                    ],
                                })(
                                    <Input disabled={isDisabled} placeholder="请输入电话"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="邮箱"
                            >
                                {getFieldDecorator('email', {
                                    initialValue:this.state.userMail,
                                    rules: [{
                                        required: !isDisabled, message: '邮箱必填!',
                                    },{
                                        validator: this.checkValidator
                                    }],
                                })(
                                    <Input disabled={isDisabled} placeholder="请输入邮箱"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="用户名"
                            >
                                {getFieldDecorator('loginNubmer', {
                                    initialValue:this.state.userAccount,
                                    rules: [{
                                        required: !isDisabled, message: '用户名必填!',
                                    },{
                                        validator: this.checkValidator
                                    }],
                                })(
                                    <Input disabled={isDisabled} placeholder="请输入用户名"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            {
                                isEdit ?
                                    <FormItem>
                                        <Button type="primary" htmlType="submit">保存</Button>
                                        <Button style={{ marginLeft: 8 }} type="primary" onClick={this._HandleInfo.bind(this)}>取消</Button>
                                    </FormItem>
                                    :
                                    <FormItem>

                                        <Button style={{ marginLeft: 8 }} type="primary" onClick={this._ChangeInfo.bind(this)}>修改</Button>
                                    </FormItem>
                            }
                        </Col>
                    </Row>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelImg}>
                        <img alt="example" style={{ width: '100%' }} src={imgDataUrl} />
                    </Modal>
                </Form>
            </Spin>
        )
    }
    //取消编辑
    _HandleInfo(){
        const {setFieldsValue} = this.props.form;
        setFieldsValue({
            phone:getUser().userPhone+11111,
            email:getUser().userMail,
            loginNubmer:getUser().userAccount
        });
        this.setState({
            isDisabled:true,
            isEdit:false,
        })
    }
    //修改用户信息的相关状态
    _ChangeInfo(){
        this.setState({
            isDisabled:false,
            isEdit:true
        })
    }

    //附件上传前校验
    beforeUpload = (file) =>{
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) { //添加文件限制
            message.error('文件大小不能超过10M');
            return false;
        }
        if(file.type.indexOf('image') === -1){
            message.error('只能上传照片附件');
            return false;
        }
    };
    //附件上传完成
    imgChange(info){
        const {file,fileList} = info;
        if (file.status === 'uploading') {
            this.setState({ iconLoading: true });
            return;
        }
        if (file.status === 'done') {
            let respone = file.response.res.src;
            this.setState({
                iconLoading:false,
                imgDataUrl:'http://db.mayunyi.top/blog/static'+respone[0],
            });
        }
    }

    //上传附件预览
    handlePreview = () => {
        //这边还还可以上传上传服务器上的附件 需要接口确认
        this.setState({
            previewVisible: true,
        });
    };

    //取消图片预览的对话框
    handleCancelImg = () => this.setState({ previewVisible: false });

    //移除文件
    imgRemove = () =>{
        this.setState({
            imgDataUrl:''
        })
    };


    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err, values)
            debugger
        })
    };

    //自定义校验规则
    checkValidator = (rule, value, callback) =>{
        const { fullField } = rule;
        switch(fullField){
            case 'phone':
                if(!(/^1[34578]\d{9}$/.test(value)) && value){
                    callback('请输入有效的手机号码')
                } else if(!value){
                    callback()
                }
                break;
            case 'email':
                if(!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) && value){
                    callback('请输入邮箱地址')
                } else if(!value){
                    callback()
                }
                break;
            case 'loginNubmer':
                if(!(/^[a-zA-Z][a-zA-Z0-9]{3,15}$/.test(value)) && value){
                    callback('用户名由英文字母和数字组成的4-16位字符，以字母开头')
                } else if(!value){
                    callback()
                }
                break;
            default:
                callback()
        }


    }
}
PersonalCenter = Form.create()(PersonalCenter);
export default PersonalCenter

