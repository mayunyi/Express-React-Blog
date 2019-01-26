import React,{ Component } from 'react';
import {getUser} from "../../auth";
import '../styles/ResumePage.css';
import {message} from 'antd'
const Fragment = React.Fragment;

export default class ResumePage  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bannerList: [                 //盒子背景颜色
                {
                    bg: ""
                },
                {
                    bg: "#87d9e1"
                },
                {
                    bg: "#8185d7"
                },
                {
                    bg: "#e187cf"
                }
            ],
            offsetheight: document.documentElement.clientHeight -64,    //获取当前页面的高度
            fullPage: 0,           //当前在第几页
            fullPageNum: false        //是否在滑动
        };
        this.user =getUser();
    }

    componentDidMount() {
        if(!this.user.userId){
            return message.warning('请登录！')
        } else{
            this.getResumeData(this.user.userId)
            //添加鼠标滑动事件
            if (document.addEventListener) {
                document.addEventListener('DOMMouseScroll', this.scroll.bind(this), false);
            }
            window.onmousewheel = document.onmousewheel = this.scroll.bind(this);
        }
    }

    getResumeData(userId){
        fetch(`/api/resume/user/${userId}`).then(rep=>{
            return rep.json()
        }).then(json=>{
            if(json.status === 2){
                let avatarObj = {
                    avatarDec:'世上只有想不通的人，没有走不通的路。',
                    avatar:json.data.avatar
                };
                let userInfo = {
                    education:json.data.education,
                    name:json.data.name,
                    sex:json.data.sex,
                    major:json.data.major,
                    race:json.data.race,
                    age:json.data.age,
                    race:json.data.race,
                }


                debugger
            } else {

            }
        })
    }

    //点击左侧小点时跳转到相应的page
    pageInfo(index) {
        this.setState({
            fullPage: index
        })
    }

    //鼠标事件
    scroll(e) {
        let event = e || window.event;
        //
        //是否正在滑动
        //
        if (this.state.fullPageNum) {
            return false;
        }
        //   e.wheelDelta为负数时向下滑动
        if (event.wheelDelta < 0) {
            if (this.state.fullPage >= 3) {
                return false;
            }
            this.setState({fullPageNum: true});
            this.pageInfo(this.state.fullPage + 1);

            //  css设置动画事件为1000，所以等到1000ms后滚动状态为false
            setTimeout(() => {
                this.setState({fullPageNum: false});
            }, 1000);
            //   否则就是向上划
        } else {
            if (this.state.fullPage <= 0) {
                return false;
            }
            this.setState({fullPageNum: true});
            this.pageInfo(this.state.fullPage - 1);
            setTimeout(() => {
                this.setState({fullPageNum: false})
            }, 1000)
        }
    }

    render() {

        let fullPage = this.state.bannerList.map((i, index) => {
            if(index === 0){
                return <div key={index} className='resume_me' style={{'height': this.state.offsetheight + 'px'}}></div>
            } else{
                return <div key={index} style={{'height': this.state.offsetheight + 'px', 'background': i.bg}}>{index}</div>
            }
        });
        let fullList = this.state.bannerList.map((i, index) => {
            return <div key={index} className={this.state.fullPage === index ? 'color' : ''}
                        onClick={this.pageInfo.bind(this, index)}/>
        });

        return (
            <div className="section" style={{'height': this.state.offsetheight + 'px'}}>
                <div className="container"
                     style={{'transform': 'translate3d(0px,-' + this.state.fullPage * this.state.offsetheight + 'px, 0px)'}}>
                    {fullPage}
                </div>
                <div className="fixed-list">
                    {fullList}
                </div>
            </div>
        )
    }
}
