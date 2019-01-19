/**
 * 后台管理导航栏
 */

import React,{Component} from "react";
import {Menu,Icon} from 'antd'
import { Link } from  'react-router-dom'
export default class MenuAdmin extends Component{
    constructor(props,context){
        super(props,context);
        this.state = {
            menuKey:['1']
        };
    }
    componentDidMount(){
        let localhost = this.props.location.pathname;
        switch (localhost){
            case "/admin" :
                this.setState({
                    menuKey:['1']
                });
                break;
            case "/admin/tagsAdministration" :
                this.setState({
                    menuKey:['2']
                });
                break;
            case "/admin/articleAdministration" :
                this.setState({
                    menuKey:['3']
                });
                break;
            case "/admin/personalcenter" :
                this.setState({
                    menuKey:['4']
                });
                break;
            default:
                this.setState({
                    menuKey:['1']
                });
                break;
        }
    }
    componentWillReceiveProps(nextProps){
        switch (nextProps.location.pathname){
            case "/admin" :
                this.setState({
                    menuKey:['1']
                });
                break;
            case "/admin/tagsAdministration" :
                this.setState({
                    menuKey:['2']
                });
                break;
            case "/admin/articleAdministration" :
                this.setState({
                    menuKey:['3']
                });
                break;
            case "/admin/personalcenter" :
                this.setState({
                    menuKey:['4']
                });
                break;
            case "/admin/about" :
                this.setState({
                    menuKey:['5']
                });
                break;
            default:
                this.setState({
                    menuKey:['1']
                });
                break;
        }
    }
    handleClick(value){
        this.setState({
            menuKey:[value.key]
        })
    }
    render(){
        return(
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={this.state.menuKey}
                onClick={this.handleClick.bind(this)}
            >
                <Menu.Item key="1">
                    <Link  to="/admin">
                        <Icon type="edit" theme="filled" />
                        <span className="nav-text">新增文章</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link  to="/admin/tagsAdministration">
                        <Icon type="tags" theme="filled" />
                        <span className="nav-text">标签列表</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link  to="/admin/articleAdministration">
                        <Icon type="file-text" theme="filled" />
                        <span className="nav-text">文章管理</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="4">
                    <Link  to="/admin/personalcenter">
                        <Icon type="file-text" theme="filled" />
                        <span className="nav-text">个人中心</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="5">
                    <Link  to="/admin/about">
                        <Icon type="file-text" theme="filled" />
                        <span className="nav-text">编辑关于</span>
                    </Link>
                </Menu.Item>
            </Menu>
        )
    }
}
