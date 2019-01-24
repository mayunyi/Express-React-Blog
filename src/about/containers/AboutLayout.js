/**
 * Created by mahai on 2019/1/24.
 *
 */

import React, { Component } from 'react';
import { Skeleton } from 'antd';
import {getUser} from '../../auth';
import AboutConent from '../components/AboutConent'
const Fragment = React.Fragment;
export default class AboutLayout extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            aboutData :{}
        };
        this.user = getUser();
    }
    componentDidMount(){
        //获取登录用户的关于信息
        this.getuserAbout();
    }

    getuserAbout(){
        this.setState({
            loading:true
        });
        fetch(`/api/about/user/${this.user.userId}`).then(rep=>{
            return rep.json()
        }).then(json=>{
            let self = this;
            if(json.status === 2){
                setTimeout(()=>{
                    self.setState({
                        aboutData:json.data,
                        loading:false
                    })
                },1000)
            } else {
                setTimeout(()=>{
                    self.setState({
                        aboutData:{},
                        loading:false
                    })
                },1000)
            }
        })
    }

    render(){
        const { loading } = this.state;
        return(
            <Fragment>
                {
                    loading?<Skeleton/> : <AboutConent {...this.props} aboutData= {this.state.aboutData}/>
                }
            </Fragment>
        )
    }

}