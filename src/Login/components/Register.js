/**
 * Created by mahai on 2019/1/7.
 * 注册用户
 */

import React,{Component} from "react";
import { Link } from 'react-router-dom';
import { Form, Icon, Input, Button, message} from 'antd';
import {connect} from 'react-redux';
import MtBaker from '../../../public/Mt_Baker.mp4'
import '../styles/register.css'
class Register extends  Component {

    constructor(props,context){
        super(props,context);
        this.state = {
            confirmDirty: false,
        }
    }


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
        if (value && value !== form.getFieldValue('password')) {
            callback('密码和确认密码不一致!');
        } else {
            callback();
        }
    };


    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };


    //注册事件
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let registerObj = {
                    name:values.name,
                    email:values.email,
                    password:values.password,
                    //avatar:'//p3a.pstatp.com/weili/l/79054095780074136.jpg'
                };
                fetch('/api/users/register',{
                    method:"POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body:  JSON.stringify(registerObj)
                }).then(rep=>{
                    return rep.json()
                }).then(json=>{
                    if(typeof json === 'object'){
                        this.props.history.push("/login");
                        message.success('注册成功！')
                    } else {
                        message.error(json)
                    }
                })
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        return (
            <div className="registerLaryout">
                <video className="registerbg_video" src={MtBaker}  loop muted autoPlay="autoplay" width="100%" />
                <Form onSubmit={this.handleSubmit} className="registerContainer">
                    <Form.Item
                        {...formItemLayout}
                        label="用户名"
                    >
                        {getFieldDecorator('name', {
                            rules: [ {
                                required: true, message: '请输入用户名!',
                            }],
                        })(
                            <Input placeholder="请输入用户名"/>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="注册账号"
                    >
                        {getFieldDecorator('email', {
                            rules: [{
                                type: 'email', message: '输入的不是EMAIL地址!',
                            }, {
                                required: true, message: '请输入EMAIL地址!',
                            }],
                        })(
                            <Input placeholder="仅支持邮箱注册"/>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="密码"
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: '请输入密码!',
                            }, {
                                validator: this.validateToNextPassword,
                            }],
                        })(
                            <Input type="password" placeholder="请输入密码"/>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="确认密码"
                    >
                        {getFieldDecorator('confirm', {
                            rules: [{
                                required: true, message: '请输入确认密码!',
                            }, {
                                validator: this.compareToFirstPassword,
                            }],
                        })(
                            <Input type="password" onBlur={this.handleConfirmBlur} placeholder="请再次输入密码"/>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...tailFormItemLayout}
                    >
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            注册
                        </Button>
                        &nbsp;&nbsp; Or <Link to='/login'><span style={{fontSize:15}}>登录</span></Link>
                    </Form.Item>

                </Form>
            </div>
        )
    }
}

const RegisterComponent = Form.create()(Register);
export default RegisterComponent;

