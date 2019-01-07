/**
 * Created by mahai on 2019/1/7.
 * 注册用户
 */

import React,{Component} from "react";
import { Link } from 'react-router-dom';
import { Form, Icon, Input, Button, message} from 'antd';
import {connect} from 'react-redux';
import FlyingBirds from '../../../public/Flying-Birds.mp4'
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
    }

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
                <video className="registerbg_video" src={FlyingBirds}  loop muted autoPlay="autoplay" width="100%" />
                <Form onSubmit={this.handleSubmit} className="registerContainer">
                    <Form.Item
                        {...formItemLayout}
                        label="E-mail"
                    >
                        {getFieldDecorator('email', {
                            rules: [{
                                type: 'email', message: '输入的不是EMAIL地址!',
                            }, {
                                required: true, message: '请输入EMAIL地址!',
                            }],
                        })(
                            <Input />
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
                            <Input type="password" />
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
                            <Input type="password" onBlur={this.handleConfirmBlur} />
                        )}
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

const RegisterComponent = Form.create()(Register);
export default RegisterComponent;

