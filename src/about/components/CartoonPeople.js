/**
 * Created by mahai on 2019/1/24.
 * 卡通人物 css构造
 */

import React, { Component } from 'react';
import { Tooltip } from 'antd';
import '../style/CartoonPeople.css'

export default class CartoonPeople extends Component {
    constructor(props){
        super(props);
        this.state = {
            tipVisible:false,
            text:''
        }
    }

    onBlur = () =>{
        this.setState({
            tipVisible:true,
            text:'点击部位有惊喜'
        })
    };

    onMouseOut = () => {
        this.setState({tipVisible:false})
    };

    peopleClick = (type) =>{
        if(type==='hair') {
            this.setState({
                tipVisible:true,
                text:'主人，不要摸人家的头会长不大的！'
            })
        }
        if(type==='body') {
            this.setState({
                tipVisible:true,
                text:'咯吱！咯吱！好啦！好啦！'
            })
        }
    };
    render(){

        return(
            <div className="Layout">
                <Tooltip
                    placement="top"
                    title={this.state.text}
                    visible = {this.state.tipVisible}
                    onMouseEnter={this.onBlur}
                    onMouseLeave={this.onMouseOut}
                >
                    <section className="butters" >
                        <div className="hair" onClick={this.peopleClick.bind(this,'hair')}></div>
                        <div className="head">
                            <div className="eyebrow"></div>
                            <div className="eye">
                                <div className="iris"></div>
                                <div className="iris-up"></div>
                            </div>
                            <div className="closed_eye">
                                <div className="closed_eyelid"></div>
                            </div>
                            <div className="mouth"></div>
                            <div className="opened_mouth"></div>
                        </div>
                        <div className="body" onClick={this.peopleClick.bind(this,'body')}>
                            <div className="armpits"></div>
                            <div className="ziper"></div>
                            <div className="arm">
                                <div className="hand">
                                    <div className="thumb"></div>
                                </div>
                            </div>
                        </div>
                        <div className="leg">
                            <div className="feet"></div>
                        </div>
                    </section>
                </Tooltip>
            </div>
        )
    }
}
