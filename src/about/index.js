

import React,{Component} from "react";
import HeaderComponent from '../_component/Header'
import AboutLayout from './containers/AboutLayout';
import './index.css'
export default class About extends Component{
    constructor(props,context){
        super(props,context);
    }


    render() {
        return (
            <div>
                <HeaderComponent {...this.props}/>
                {/*<div className="about-me">*/}
                    {/*<h1>关于我</h1>*/}
                    {/*<ul>*/}
                        {/*<li>真正的才智是刚毅的志向。 —— 拿破仑</li>*/}
                        {/*<li>人的理想志向往往和他的能力成正比。 —— 约翰逊</li>*/}
                        {/*<li>志向不过是记忆的奴隶，生气勃勃地降生，但却很难成长。 —— 莎士比亚</li>*/}
                    {/*</ul>*/}
                {/*</div>*/}
                {/*<hr/>*/}
                {/*<div className="about-me">*/}
                    {/*<h1>联系我</h1>*/}
                    {/*<ul>*/}
                        {/*<li>个人主页：<a  target="_blank" rel="noopener noreferrer" href="http://www.mayunyi.top">www.mayunyi.top</a></li>*/}
                        {/*<li>Email： kuel980@outlook.com</li>*/}
                        {/*<li>Github：<a target="_blank" rel="noopener noreferrer" href="https://github.com/mayunyi">https://github.com/mayunyi</a></li>*/}
                    {/*</ul>*/}
                {/*</div>*/}
                {/*<hr />*/}
                {/*<div className="about-me">*/}
                    {/*<h1>友情链接</h1>*/}
                    {/*<ul>*/}
                        {/*<li><a target="_blank" rel="noopener noreferrer" href="https://phodal.com">Phodal</a></li>*/}
                        {/*<li><a target="_blank" rel="noopener noreferrer" href="http://sundway.me">Sundway</a></li>*/}
                    {/*</ul>*/}
                {/*</div>*/}
                {/*<hr />*/}
                <AboutLayout {...this.props}/>
            </div>
        )
    }
}
