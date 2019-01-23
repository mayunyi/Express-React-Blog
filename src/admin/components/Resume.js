/**
 * 简历
 **/

import React, { Component } from 'react';
import AddResume from './AddResume';
import ShowResume from './ShowAndEditResume';
import {getUser} from '../../auth';
const Fragment = React.Fragment;

export default class Resume extends Component{
    constructor(props){
        super(props);
        this.state = {
            isResumData:false,  //  判断是是否创建了用户数据
            data:{}
        };
        this.user = getUser();
    }
    componentDidMount(){
        this.getUserResume();
    }

    //获取简数据
    getUserResume(){
        fetch(`/api/resume/user/${this.user.userId}`).then(rep=>{
            return rep.json()
        }).then(json =>{
            if(json.status === 2){
                this.setState({
                    isResumData:true,
                    data:json.data
                })
            } else if(json.status === 1){
                this.setState({
                    isResumData:false,
                    data:{}
                })
            }
        })
    }

    render(){
        const {data,isResumData} = this.state;
        return(
            <Fragment>
                {
                    isResumData ? <ShowResume {...this.props} data = {data} getUserResume = {this.getUserResume.bind(this)}/>:<AddResume {...this.props} getUserResume = {this.getUserResume.bind(this)}/>
                }
            </Fragment>
        )
    }
}
