import React,{Component} from "react";
import {Link} from "react-router-dom"
import "./styles/header.css";
import { connect } from "react-redux";
import { getUser,clearUser } from "../auth";
import {actionCreators} from "../Login/store";
import { Avatar,Menu, Dropdown,Icon } from "antd";
const { loginIn,loginOut } = actionCreators;
@connect(
    state =>({...state.login}),
    { loginIn,loginOut }
)
export default class HeaderComponent extends  Component {
    constructor(props,context){
        super(props,context);
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
            case 'logout':
                this.LoginHeader();
                break;
        }
    };
    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key='idcard'>
                    <Icon type="idcard" theme="filled" />个人信息
                </Menu.Item>
                <Menu.Item key='setting'>
                    <Icon type="setting" theme="filled" />后台管理
                </Menu.Item>
                <Menu.Item key='logout'>
                    <i className = 'iconfont' >&#xe616;</i>退出
                </Menu.Item>
            </Menu>
        );
        console.log(getUser(),this.props.login)
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
            </div>
        )
    }
}
