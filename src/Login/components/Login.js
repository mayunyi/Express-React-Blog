/**
 * Created by mahai on 2018/11/27.
 * 登录
 */


import React,{Component} from "react";
import { Link } from 'react-router-dom';
import { Form, Icon, Input, Button, message} from 'antd';
import '../styles/login.css';
import {setUser,getUser} from '../../auth';
import {connect} from 'react-redux';
import {actionCreators} from '../store';
const { loginIn } = actionCreators;
const FormItem = Form.Item;
import FlyingBirds from '../../../public/Flying-Birds.mp4'
@connect(
    state =>({...state.login}),
    {loginIn}
)
class WrappedNormalLoginForm extends  Component {
    constructor(props,context){
        super(props,context);
    }

    componentDidMount(){
        console.log(getUser())
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                fetch('/blog/sign/in',{
                    method:"POST",
                    mode: "cors",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body:  JSON.stringify({userAccount:values.Username,userPassword:values.password})
                }).then(rep=>{
                    return rep.json();

                }).then(json=>{
                    if(typeof(json) === 'string'){

                    } else if (json == null){
                        return message.error('没有该用户！')
                    } else {
                        const {userName, userId, userAccount, userPhone, userPicture, userMail} = json;
                        setUser(userName, userId, userAccount, userPhone, userPicture, userMail);
                        this.props.loginIn(true);
                        this.props.history.push("/");
                    }
                })
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="main" >
                <video className="bg_video" src={FlyingBirds}  loop muted autoPlay="autoplay" width="100%" />
                <Form onSubmit={this.handleSubmit} className="container">
                    <FormItem>
                        {getFieldDecorator('Username', {
                            rules: [{ required: true, message: '请输入账号!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="账号" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary"  style = {{width:'100%'}}>
                            <Link to='/'>首页</Link>
                        </Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}


const Login = Form.create()(WrappedNormalLoginForm);
export default Login;

