import React,{ Component } from 'react';
import {getUser} from "../../auth";
import '../styles/ResumePage.css';
import {message} from 'antd'
const Fragment = React.Fragment;

export default class ResumePage  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bannerList: [],
            offsetheight: document.documentElement.clientHeight -64,    //获取当前页面的高度
            fullPage: 0,           //当前在第几页
            fullPageNum: false,        //是否在滑动
            resumeData:{}       //简历的原始数据
        };
        this.user =getUser();
    }

    componentDidMount() {
        if(!this.user.userId){
            return message.warning('请登录！')
        } else{
            //添加鼠标滑动事件
            if (document.addEventListener) {
                document.addEventListener('DOMMouseScroll', this.scroll.bind(this), false);
            }
            window.onmousewheel = document.onmousewheel = this.scroll.bind(this);
            this.getResumeData(this.user.userId);
        }
    }

    componentWillUnmount(){
        //组件卸载调用
        this.setState = (state,callback)=>{
            return;
        };
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
                    name:json.data.name,
                    age:json.data.age,
                    race:json.data.race,
                    sex:json.data.sex,
                    education:json.data.education,
                    major:json.data.major,
                    qq:json.data.qq,
                    phone:json.data.phone,
                    email:json.data.email,
                };
                let schoolAndInsterst = {
                    interest: json.data.interest,
                    school:json.data.school
                };
                let resumeArr = [
                    {
                        data:avatarObj,
                        bg:'',
                        type:'avatar'
                    },{
                        data:userInfo,
                        bg: "#87d9e1",
                        type:'user'
                    },{
                        bg: "#8185d7",
                        data:json.data.job,
                        type:'job'
                    },{
                        bg: "#c60cff",
                        data:schoolAndInsterst,
                        type:'school'
                    },{
                        bg: "#c5d76a",
                        data:json.data.sill,
                        type:'sill'

                    },{
                        bg: "#d74824",
                        data:json.data.project,
                        type:'project'
                    },{
                        bg: "#d74ec8",          //自我评价
                        data:json.data.evaluation,
                        type:'evaluation'
                    }
                ];
                this.setState({
                    bannerList:resumeArr,
                    resumeData:json.data
                })
            } else {
                this.setState({
                    bannerList:[]
                });
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
            if (this.state.fullPage >= this.state.bannerList.length) {
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
            switch (i.type) {
                case 'avatar':
                    return (
                        <div key={index} className='resume_me' style={{'height': this.state.offsetheight + 'px'}}>
                            <div className='cen_con'>
                                <div className='portrait'>
                                    <img src={i.data.avatar}/>
                                </div>
                                <div className='cen_text'>
                                    <h2>{i.data.avatarDec}</h2>
                                    <hr/>
                                    <h3>{this.state.resumeData.name}</h3>
                                </div>
                            </div>
                        </div>
                    );
                case 'user':
                    return (
                        <div key={index} style={{'height': this.state.offsetheight + 'px', 'background': i.bg}}>
                            <div className='userInfo'>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>{`姓名 | ${i.data.name}`}</td>
                                            <td>{`手机 | ${i.data.phone}`}</td>
                                        </tr>
                                        <tr>
                                            <td>{`性别 | ${i.data.sex==1?'男':'女'}`}</td>
                                            <td>{`邮箱 | ${i.data.email}`}</td>
                                        </tr>
                                        <tr>
                                            <td>{`出生 | ${i.data.age}`}</td>
                                            <td>{`QQ号 | ${i.data.qq}`}</td>
                                        </tr>
                                        <tr>
                                            <td>{`籍贯 | ${i.data.race}`}</td>
                                            <td>户籍 | 江苏省常州市</td>
                                        </tr>
                                        <tr>
                                            <td>{`学历 | ${i.data.education}`}</td>
                                            {
                                                i.data.major !=='' && <td>{`专业 | ${i.data.major}`}</td>
                                            }
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                case 'job':
                    return (
                        <div key={index} style={{'height': this.state.offsetheight + 'px', 'background': i.bg}}>
                            <div className='job'>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>{`职位 | ${i.data.position}`}</td>
                                        <td>{`工作地点 | ${i.data.workingPlace}`}</td>
                                    </tr>
                                    <tr>
                                        <td>{`类型 | ${i.data.status==1?'全职':'兼职'}`}</td>
                                        <td>{`薪资 | ${i.data.salary}`}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                case 'school':
                    return (
                        <div key={index} style={{'height': this.state.offsetheight + 'px', 'background': i.bg}}>
                            <div className='Title'>
                                <div className='Title_wrap'>
                                    <h1>教育经历</h1>
                                    {/*<div className="scissors">*/}
                                        {/*<span></span>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                            <div className='school'>
                                <table>
                                    <tbody>
                                        {
                                            i.data.school.map((item,key)=>{
                                                return (
                                                    <tr key={key+'_'+item.name}>
                                                        <td>{`学校 : ${item.name}`}</td>
                                                        <td>{`时间 : ${item.time[0]} ~ ${item.time[1]}`}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='Title_wrap'>
                                <h1>我的爱好</h1>
                                {/*<div className="scissors">*/}
                                {/*<span></span>*/}
                                {/*</div>*/}
                            </div>
                            <div className='school'>
                                <table>
                                    <tbody>
                                        <tr >
                                            {
                                                i.data.interest.map((item,key)=>{
                                                    return (
                                                            <td  key={key+'_'+item}>{item}</td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                case 'sill':
                    return (
                        <div key={index} style={{'height': this.state.offsetheight + 'px', 'background': i.bg}}>
                            <div className='userInfo'>

                            </div>
                        </div>
                    );
                case 'project':
                    return (
                        <div key={index} style={{'height': this.state.offsetheight + 'px', 'background': i.bg}}>
                            <div className='userInfo'>

                            </div>
                        </div>
                    );
                case 'evaluation':
                    return (
                        <div key={index} style={{'height': this.state.offsetheight + 'px', 'background': i.bg}}>
                            <div className='userInfo'>

                            </div>
                        </div>
                    );
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
