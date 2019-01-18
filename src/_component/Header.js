import React,{Component} from "react";
import {Link} from "react-router-dom"
import "./styles/header.css";
import { connect } from "react-redux";
import { getUser,clearUser } from "../auth";
import {actionCreators} from "../Login/store";
import { Avatar,Menu, Dropdown,Icon,Modal,Row,Col,Form,Input,message } from "antd";
const FormItem = Form.Item;

const { loginIn,loginOut } = actionCreators;
@connect(
    state =>({...state.login}),
    { loginIn,loginOut }
)
class HeaderComponent extends  Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            visiblePassword:false
        }
    }
    componentDidMount(){
        const user = getUser();
        if(user.userId){
            this.props.loginIn(true)
        }
    }

    LoginHeader = () =>{
        clearUser();
        if(this.props.location.pathname = '/admin'){
            this.props.history.push('/')
        }
        this.props.loginOut(false)
    };
    handleMenuClick =(e) =>{
        switch (e.key) {
            case 'idcard':
                this.props.history.push('/admin/personalcenter');
                break;
            case 'setting':
                this.props.history.push('/admin');
                break;
            case 'password':
                this.showPasswordModal();
                break;
            case 'logout':
                this.LoginHeader();
                break;
        }
    };

    showPasswordModal = () => {
        this.setState({
            visiblePassword: true,
        });
    };
    /***
     * 提交修改密码数据
     * 密码修改成功后重新登录
     */
    handlePasswordModalOk = (e) => {
        this.props.form.validateFields((err, values) => {
            if(!err){
                const user = getUser();
                if(!user.userId){
                    return message.error('请登录！')
                }
                let passwordParams = {
                    id:user.userId,
                    password:values.nowPassword,
                    newpassword:values.newPassword,
                };
                fetch('/api/users/compare',{
                    method:"POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":user.token
                    },
                    body: JSON.stringify(passwordParams),
                }).then(rep =>{
                    return rep.json()
                }).then(json=>{
                    if(json.status === 2){
                        clearUser();
                        this.props.loginOut(false); //将 reducer中的状态变更一下
                        // 跳转登录页面
                        this.props.history.push('/login');
                        this.setState({
                            visiblePassword: false,
                        });
                    } else {
                        message.error(json.msg)
                    }

                })
            }
        })
    };
    handlePasswordModalCancel = (e) => {
        this.setState({
            visiblePassword: false,
        });
    };

    //自定义密码校验
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if(value && value.length <6 ){
            callback('密码长度必须大于或等于6位数！');
        }
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    //自定义确认密码校验
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('新密码和确认密码不一致!');
        } else {
            callback();
        }
    };
    render() {

        let self = this;
        const { getFieldDecorator } = self.props.form;

        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key='idcard'>
                    <Icon type="idcard" theme="filled" />个人信息
                </Menu.Item>
                <Menu.Item key='setting'>
                    <Icon type="setting" theme="filled" />后台管理
                </Menu.Item>
                <Menu.Item key='password'>
                    <i className = 'iconfont' >&#xe640;</i>&nbsp;&nbsp;修改密码
                </Menu.Item>
                <Menu.Item key='logout'>
                    <i className = 'iconfont' >&#xe616;</i>&nbsp;&nbsp;退出
                </Menu.Item>
            </Menu>
        );

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };

        return (
            <div className="header-link">
                <li>
                    <Link to='/'>首页</Link>
                </li>
                <li>
                    <Link to='/artlicelist'>文章</Link>
                </li>
                <li>
                    <Link to='/pigeonhole'>归档</Link>
                </li>
                <li>
                    <Link to='/about'>关于</Link>
                </li>
                <div>
                    {
                        this.props.login ?
                            <Dropdown overlay={menu}>
                                <Avatar src={getUser().avatar} />
                            </Dropdown>

                            :
                            <Link to='/login'>
                                <i className = 'iconfont' >&#xe62e;</i>
                                登录
                            </Link>
                    }
                    {
                        this.props.login ?null : <Link to='/register'><i className = 'iconfont' >&#xe62d;</i>注册</Link>
                    }
                </div>
                <Modal
                    title="修改密码"
                    visible={this.state.visiblePassword}
                    onOk={this.handlePasswordModalOk}
                    onCancel={this.handlePasswordModalCancel}
                    closable={false}
                    cancelText = {'取消'}
                    okText = {'确认'}
                >
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="当前密码"
                            >
                                {getFieldDecorator('nowPassword', {
                                    rules: [{
                                        required: true, message: '请输入当前密码!',
                                    }],
                                })(
                                    <Input type="password" placeholder="请输入当前密码"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="新密码"
                            >
                                {getFieldDecorator('newPassword', {
                                    rules: [{
                                        required: true, message: '请输入新密码!',
                                    }, {
                                        validator: this.validateToNextPassword,
                                    }],
                                })(
                                    <Input type="password" placeholder="请输入新密码"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="确认密码"
                            >
                                {getFieldDecorator('configPassword', {
                                    rules: [{
                                        required: true, message: '请输入确认密码!',
                                    }, {
                                        validator: this.compareToFirstPassword,
                                    }],
                                })(
                                    <Input type="password" placeholder="请输入确认密码"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}
HeaderComponent = Form.create()(HeaderComponent);
export default HeaderComponent
