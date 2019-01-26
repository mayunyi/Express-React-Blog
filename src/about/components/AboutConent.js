/**
 * Created by mahai on 2019/1/24.
 * 显示关于数据
 */
import React from "react";
import '../style/AboutConent.css'

const Fragment = React.Fragment;
const AboutConent = (props) =>{
    const aboutData = props.aboutData;



    return(
        <Fragment>
            <div className="avatar">
                <img src = {aboutData.img}/>
            </div>
            <div className="about-me">
                <h1>关于我</h1>
                <ul>
                    {
                        aboutData.WellknownSaying && aboutData.WellknownSaying.map((item,index)=>{
                            return <li key={index}><span dangerouslySetInnerHTML={{ __html: item}}></span></li>
                        })
                    }
                </ul>
            </div>
            <div className="about-me">
                <h1>联系我</h1>
                <ul>
                    {
                        aboutData.contact && aboutData.contact.map((item,index)=>{
                            return (
                                <li key={index}>
                                    <span>{item.contact_name}</span>:
                                    {
                                        item.contact_number.indexOf('www') >= 0?
                                            <a  target="_blank"  href={'http://'+item.contact_number}>{item.contact_number}</a>
                                            :
                                            <span>{item.contact_number}</span>
                                    }
                                </li>
                            )

                        })
                    }
                </ul>
            </div>
            <div className="about-me">
                <h1>我的简介</h1>
                <ul>
                    {
                        aboutData.dec && <li>{aboutData.dec}</li>
                    }
                </ul>
            </div>
        </Fragment>
    )

};

export default AboutConent
