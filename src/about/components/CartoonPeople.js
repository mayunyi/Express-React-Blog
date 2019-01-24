/**
 * Created by mahai on 2019/1/24.
 * 卡通人物 css构造
 */

import React, { Component } from 'react';
import '../style/CartoonPeople.css'

export default class CartoonPeople extends Component {
    constructor(props){
        super(props);
    }

    render(){

        return(
            <div className="Layout">
                <section className="butters">
                    <div className="hair"></div>
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
                    <div className="body">
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
            </div>
        )
    }
}