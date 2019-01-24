/**
 * 简历
 **/

import React, { Component } from 'react';
import { Skeleton } from 'antd';
import AddResume from './AddResume';
import ShowResume from './ShowAndEditResume';
import {getUser} from '../../auth';
const Fragment = React.Fragment;

export default class Resume extends Component{
    constructor(props){
        super(props);
        this.state = {
            isResumData:false,  //  判断是是否创建了用户数据
            data:{},
            loading:true
        };
        this.user = getUser();
    }
    componentDidMount(){
        this.getUserResume();
    }

    //获取简数据
    getUserResume(){
        this.setState({
            loading:true
        });
        fetch(`/api/resume/user/${this.user.userId}`).then(rep=>{
            return rep.json()
        }).then(json =>{
            if(json.status === 2){
                this.setState({
                    isResumData:true,
                    data:json.data,
                    loading:false
                })
            } else if(json.status === 1){
                this.setState({
                    isResumData:false,
                    data:{},
                    loading:false
                })
            }
        })
    }

    render(){
        const {data,isResumData,loading=true} = this.state;
        return(
            <Fragment>
                {
                    loading?<Skeleton />
                        :
                        <Fragment>
                            {
                                isResumData ? <ShowResume {...this.props} data = {data} getUserResume = {this.getUserResume.bind(this)}/>:<AddResume {...this.props} getUserResume = {this.getUserResume.bind(this)}/>
                            }
                        </Fragment>
                }

            </Fragment>

        )
    }
}
