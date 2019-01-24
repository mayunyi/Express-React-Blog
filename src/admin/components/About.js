/**
 * Created by mahai on 2019/1/21.
 * 关于页面
 */
import React, { Component } from 'react';
import AddAbout from './AddAbout';
import ShowAndEditAbout from './ShowAndEditAbout';
import {getUser} from '../../auth';
import { Skeleton } from 'antd';
const Fragment = React.Fragment;

export default class About extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAboutData:false,  //  判断是是否创建了用户数据
            data:{},
            loading:true
        };
        this.user = getUser();
    }

    componentDidMount(){
       this.getUserAbout();
    }

    //获取用户关于数据
    getUserAbout = () =>{
        this.setState({
            loading:true
        });
        fetch(`/api/about/user/${this.user.userId}`).then(rep=>{
            return rep.json()
        }).then(json =>{
            if(json.status === 2){
                this.setState({
                    isAboutData:true,
                    data:json.data,
                    loading:false
                })
            } else if(json.status === 1){
                this.setState({
                    isAboutData:false,
                    data:{},
                    loading:false
                })
            }
        })
    };

    render(){
        const { isAboutData,isEdit,loading } = this.state;
        return(
            <Fragment>
                {
                    loading ? <Skeleton />
                        :
                        <Fragment>
                            {
                                isAboutData ?
                                    <ShowAndEditAbout
                                        {...this.props}
                                        data={this.state.data}
                                        getUserAbout={this.getUserAbout.bind(this)}
                                    />
                                    :
                                    <AddAbout {...this.props} getUserAbout={this.getUserAbout.bind(this)}/>
                            }
                        </Fragment>
                }
            </Fragment>
        )
    }

}