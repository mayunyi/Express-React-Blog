/**
 * Created by mahai on 2018/11/26.
 * 后台管理模块
 */

import React, { Component } from 'react';
import { Layout } from 'antd';
import HeaderComponent from '../../_component/Header';
import { Route } from  'react-router-dom';
import MenuAdmin from '../components/Menu'
import SendArticle from '../components/SendArticle';
import TagsAdministration from '../components/TagsAdministration';
import ArticleAdministration from '../components/ArticleAdministration';
import PersonalCenter from  '../components/PersonalCenter';
import EditAbout from  '../components/EditAbout';
import '../styles/AdminIndex.css'
const {Content, Footer, Sider,} = Layout;


export default class AdminLayout extends Component {


    constructor(props,context){
        super(props,context);
    }
    render() {
        return (
            <Layout >
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    style={{
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                    }}
                >
                    <div className="logo" >
                        马海的博客
                    </div>
                    <MenuAdmin {...this.props}/>
                </Sider>
                <Layout style={{ marginLeft: 200 }}>
                    <HeaderComponent {...this.props}/>
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <Route path={`${this.props.match.url}`} exact component={SendArticle}/>
                            <Route path={`${this.props.match.url}/tagsAdministration`} exact component={TagsAdministration}/>
                            <Route path={`${this.props.match.url}/articleAdministration`} exact component={ArticleAdministration}/>
                            <Route path={`${this.props.match.url}/personalcenter`} exact component={PersonalCenter}/>
                            <Route path={`${this.props.match.url}/about`} exact component={EditAbout}/>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        React Blog @ MaYunYi
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}

