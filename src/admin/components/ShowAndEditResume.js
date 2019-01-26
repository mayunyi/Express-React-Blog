import React, { Component } from 'react';
import {Upload,Icon,message,Form, Row, Col,Input,Button,Modal,Spin,Radio,DatePicker,Select} from 'antd'
import {getUser} from '../../auth';
import moment from 'moment';
import Cropper from 'react-cropper';
import Race from '../../static/data/Race.json'


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const Fragment = React.Fragment;

let sillId = 0; //新增技能是使用的id
let schoolId =0;
let projectId =0;
const fileShowUrl = 'http://localhost:5000/api/upload/img';

class ShowAndEditResume extends Component{

    constructor(props){
        super(props);
        this.state = {
            sill:[],        //技能
            school:[],      //学校
            project:[],     //项目
            interest:'',
            isEdit:false,  //  判断是是编辑

            //裁剪相关设置
            srcCropper:'',
            selectImgName:'',
            selectImgSize:0,
            selectImgSuffix:'',
            CropperVisible:false,

            previewImage:'',
            previewImgVisible:false,
            avatarList:[],
            avatar : "",

            spinLoading:false
        };
        this.user = getUser();
    }

    componentDidMount(){
        const { form } = this.props;
        const { data } = this.props;

        let sillData = data.sill;
        let schoolData = data.school;
        let projectData = data.project;

        let sill = [],school =[],project=[];

        for(let i =0; i< sillData.length;i++){
            let keyN = `name_${i+1}`;
            let keyV = `pre_${i+1}`;
            sill.push({
                [keyN]:sillData[i].name,
                [keyV]:sillData[i].pre
            });
            const sillkeys = form.getFieldValue('sillkeys');
            const nextKeys = sillkeys.concat(++sillId);
            form.setFieldsValue({
                sillkeys: nextKeys,
            });
        }
        for(let i =0; i< schoolData.length;i++){
            let keyS = `school_${i+1}`;
            let keyT = `schoolDate_${i+1}`;
            school.push({
                [keyS]:schoolData[i].name,
                [keyT]:schoolData[i].time
            });
            const schoolkeys = form.getFieldValue('schoolkeys');
            const nextKeys = schoolkeys.concat(++schoolId);
            form.setFieldsValue({
                schoolkeys: nextKeys,
            });
        }
        for(let i =0; i< projectData.length;i++){
            let keyP = `project_${i+1}`;
            let keyD = `projectDate_${i+1}`;
            let keyE = `projectDec_${i+1}`;
            project.push({
                [keyP]:projectData[i].name,
                [keyD]:projectData[i].time,
                [keyE]:projectData[i].dec
            });
            const projectkeys = form.getFieldValue('projectkeys');
            const nextKeys = projectkeys.concat(++projectId);
            form.setFieldsValue({
                projectkeys: nextKeys,
            });
        }
        let avatarList =[];
        if(data.avatar){
            avatarList.push({
                uid: '-1',
                name: '头像.png',
                status: 'done',
                url: data.avatar
            })
        }
        let interest = '';
        for(let i=0;i<data.interest.length;i++){
            if(i === data.interest.length-1){
                interest += data.interest[i]
            } else {
                interest += data.interest[i]+'、'
            }
        }
        this.setState({
            avatar:data.avatar,
            avatarList,
            sill,
            project,
            school,
            interest
        })
    }

    componentWillUnmount(){
        //组件卸载调用
        const { form } = this.props;
        sillId = 0; //新增技能是使用的id
        schoolId =0;
        projectId =0;
        form.resetFields();
        this.setState = (state,callback)=>{
            return;
        };
    }

    projectAdd = () =>{
        const { form } = this.props;
        const { project } = this.state;
        const projectKeys = form.getFieldValue('projectkeys');
        const nextKeys = projectKeys.concat(++projectId);
        let keyP = `project_${projectId}`;
        let keyD = `projectDate_${projectId}`;
        let keyE = `projectDec_${projectId}`;
        project.push({
            [keyP]:'',
            [keyD]:[undefined,undefined],
            [keyE]:''
        });
        form.setFieldsValue({
            projectkeys: nextKeys,
        });
        this.setState({
            project
        })
    };
    projectRemove = (k) =>{
        const { form } = this.props;
        const { project } = this.state;
        const projectKeys = form.getFieldValue('projectkeys');
        let newProject = [];
        form.setFieldsValue({
            projectkeys: projectKeys.filter(key => key !== k),
        });
        project.filter(key => {
            //获取对象key的第一个key
            let keyArr = Object.keys(key)[0].split('_')[1];        //取最后的数值
            if(k !== Number(keyArr)){
                newProject.push(key)
            }
        });
        this.setState({
            project:newProject
        })
    };

    schoolAdd = () =>{
        const { form } = this.props;
        const { school } = this.state;
        const schoolKeys = form.getFieldValue('schoolkeys');
        const nextKeys = schoolKeys.concat(++schoolId);
        let keyN = `school_${schoolId}`;
        let keyV = `schoolDate_${schoolId}`;
        form.setFieldsValue({
            schoolkeys: nextKeys,
        });
        school.push({
            [keyN]:'',
            [keyV]:[undefined,undefined]
        });
        this.setState({
            school
        })
    };
    schoolRemove = (k) =>{
        const { form } = this.props;
        const { school } = this.state;
        const schoolKeys = form.getFieldValue('schoolkeys');
        let newSchool = [];
        form.setFieldsValue({
            schoolkeys: schoolKeys.filter(key => key !== k),
        });
        school.filter(key => {
            //获取对象key的第一个key
            let keyArr = Object.keys(key)[0].split('_')[1];        //取最后的数值
            if(k !== Number(keyArr)){
                newSchool.push(key)
            }
        });
        this.setState({
            school:newSchool
        })
    };

    skillAdd = () =>{
        const { form } = this.props;
        const { sill } = this.state;
        const skillKeys = form.getFieldValue('sillkeys');
        const nextKeys = skillKeys.concat(++sillId);
        let keyN = `name_${sillId}`;
        let keyV = `pre_${sillId}`;
        sill.push({
            [keyN]:'',
            [keyV]:''
        });
        form.setFieldsValue({
            sillkeys: nextKeys,
        });
        this.setState({
            sill
        })
    };
    //联系方式删除表格
    skillRemove = (k) =>{
        const { form } = this.props;
        const skillKeys = form.getFieldValue('sillkeys');
        const { sill } = this.state;
        let newSill = [];
        sill.filter(key => {
            //获取对象key的第一个key
            let keyArr = Object.keys(key)[0].split('_')[1];        //取最后的数值
            if(k !== Number(keyArr)){
                newSill.push(key)
            }
        });
        form.setFieldsValue({
            sillkeys: skillKeys.filter(key => key !== k),
        });
        this.setState({
            sill:newSill
        })
    };

    handleRemovepic = (file) =>this.setState({ previewImage: '',avatarList:[],avatar:'' });
    beforeUploadAvatar = (file) => {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) { //添加文件限制
            message.error('文件大小不能超过10M');
            return false;
        }
        if(file.type.indexOf('image') === -1){
            message.error('只能上传照片附件');
            return false;
        }
        let reader=new FileReader();
        //头像上传之前弹出裁剪功能
        reader.readAsDataURL(file); //开始读取文件
        // 因为读取文件需要时间,所以要在回调函数中使用读取的结果
        reader.onload = (e) => {
            this.setState({
                srcCropper: e.target.result, //cropper的图片路径
                selectImgName: file.name, //文件名称
                selectImgSize: (file.size / 1024 / 1024), //文件大小
                selectImgSuffix: file.type.split("/")[1], //文件类型
                CropperVisible: true, //打开控制裁剪弹窗的变量，为true即弹窗
            })
        };
        return false;
    };
    handleImgCancel = () => this.setState({ previewImgVisible: false });
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewImgVisible: true,
        });
    };
    _crop(){
        const croppedCanvas = this.refs.cropper.getCroppedCanvas({
            minWidth: 200,
            minHeight: 200,
        });

        croppedCanvas.toBlob(async blob => {
            if(blob){
                // 图片name添加到blob对象里
                blob.name = this.state.selectImgName;
                // 创建提交表单数据对象
                const filedata = new FormData();
                // 添加要上传的文件
                filedata.append('file', blob, blob.name);
                this.setState({
                    imgData:filedata
                });
            }
        }, "image/png");
    }

    handleCancelCropper = () =>{
        this.setState({
            CropperVisible:false,
        })
    };
    //文章上传图片
    ImgSaveCropper = () => {
        fetch('/api/upload/img',{
            method: 'POST',
            body:this.state.imgData
        }).then(rep=>{
            return rep.json()
        }).then(json=>{
            if(json.status === 2){
                let avatarList = [];
                avatarList.push({
                    uid: '-1',
                    name: '头像.png',
                    status: 'done',
                    url: fileShowUrl+'/'+json.filePath
                });
                this.setState({
                    CropperVisible:false,
                    avatarList,
                    avatar:fileShowUrl+'/'+json.filePath
                })
            } else {
                message.error('上传失败！')
            }
        })
    };


    //保存
    onSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                // this.setState({
                //     spinLoading:true,
                // });
                let job = {
                    position:values.position,
                    workingPlace:values.workingPlace,
                    salary:values.salary,
                    status:values.status
                };
                let sill = [];
                values.sillkeys.map(item=>{
                    sill.push({
                        name:values[`sill_${item}`],
                        pre:values[`pre_${item}`]
                    })
                });
                let school =[];
                values.schoolkeys.map(item=>{
                    school.push({
                        time:[moment(values[`schoolDate_${item}`][0]).format('YYYY-MM-DD'),moment(values[`schoolDate_${item}`][1]).format('YYYY-MM-DD')],
                        name:values[`school_${item}`]
                    })
                });
                let project = [];
                values.projectkeys.map(item=>{
                    project.push({
                        time:[moment(values[`projectDate_${item}`][0]).format('YYYY-MM-DD'),moment(values[`projectDate_${item}`][1]).format('YYYY-MM-DD')],
                        name:values[`project_${item}`],
                        dec:values[`projectDec_${item}`]
                    })
                });
                let subData = {
                    job:job,
                    sill:sill,
                    name:values.name,
                    sex:values.sex,
                    age:moment(values.age).format('YYYY-MM-DD'),
                    race:values.race,
                    education:values.education,
                    major:values.major,
                    school:school,
                    project:project,
                    evaluation:values.evaluation,           //  自我介绍
                    interest:values.interest && values.interest.split('、')|| [],
                    avatar:this.state.avatar,
                    qq:values.qq,
                    phone:values.phone,
                    email:values.email
                };
                let resumeId = this.props.data._id;
                fetch(`/api/resume/edit/${resumeId}`,{
                    method:"POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":this.user.token
                    },
                    body:  JSON.stringify(subData)
                }).then(rep=>{
                    return rep.json()
                }).then(json=>{
                    if(json.status === 2){
                        this.props.getUserResume();      //重新获取用户关于的数据
                        let self = this;
                        setTimeout(()=>{
                            self.setState({
                                spinLoading:false,
                                isEdit:false
                            });
                            message.success('编辑成功');
                        },1000)
                    }else {
                        this.setState({
                            spinLoading:false,
                        });
                        message.error(json.msg)
                    }
                })
            }
        })
    };
    //自定义校验规则
    validatePhone = (rule, value, callback) =>{
        const { fullField } = rule;
        switch(fullField){
            case 'phone':
                if(!(/^1[34578]\d{9}$/.test(value)) && value){
                    callback('请输入有效的手机号码')
                } else if(!value){
                    callback()
                }
                break;
            case 'email':
                if(!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) && value){
                    callback('请输入邮箱地址')
                } else if(!value){
                    callback()
                }
                break;
            default:
                callback()
        }
        callback()
    };
    render(){
        const { isEdit,avatar,avatarList,previewImgVisible,previewImage,sill,school,project } = this.state;
        const { data } = this.props;
        const { getFieldDecorator,getFieldValue } = this.props.form;
        const uploadLayout = {
            wrapperCol: {
                sm: { span: 8, offset: 10 },
            },
        };
        const jobLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const meLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 22}
        };
        const Layout = {
            labelCol: {span: 6},
            wrapperCol: {span: 18}
        };
        const Layout1 = {
            labelCol: {span: 6},
            wrapperCol: {span: 18,offset:6}
        };
        const schoolLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const schoolLayout1 = {
            labelCol: {span: 8},
            wrapperCol: {span: 16,offset:8}
        };
        const uploadButton = (
            <div>
                <Icon type='plus' />
                <div className="ant-upload-text">上传头像</div>
            </div>
        );

        //技能
        getFieldDecorator('sillkeys', { initialValue: [] });
        const skillKeys = getFieldValue('sillkeys');
        //学校
        getFieldDecorator('schoolkeys', { initialValue: [] });
        const schoolKeys = getFieldValue('schoolkeys');
        //项目
        getFieldDecorator('projectkeys', { initialValue: [] });

        const projectKeys = getFieldValue('projectkeys');
        const skillFormItem = skillKeys.map((item,index)=>{
            return (
                <Row key={index}>
                    <Col span={8}>
                        <FormItem
                            label={index==0?'技能':''}
                            {...(index === 0 ? Layout : Layout1)}
                        >
                            {getFieldDecorator(`sill_${item}`, {
                                initialValue: !isEdit ? data.sill[index].name : sill[index][`name_${item}`],
                                rules: [{
                                    required: isEdit,
                                    message: '请输入技能!',
                                }],
                            })(
                                <Input disabled={!isEdit} placeholder="请输入技能" onChange = {(e)=>this.getInputValue(e.target.value,item,'sill','name')}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            label={index==0?'熟练度':''}
                            {...(index === 0 ? Layout : Layout1)}
                        >
                            {getFieldDecorator(`pre_${item}`, {
                                initialValue: !isEdit ? data.sill[index].pre : sill[index][`pre_${item}`],
                                rules: [{
                                    required: isEdit,
                                    message: '请选择熟练度!',
                                }],
                            })(
                                <Select
                                    placeholder='请选择熟练度'
                                    disabled={!isEdit}
                                    onChange = {(value)=>this.getInputValue(value,item,'sill','pre')}
                                >
                                    <Option key={1} value = {25}>了解</Option>
                                    <Option key={2} value = {50}>掌握</Option>
                                    <Option key={3} value = {75}>熟练</Option>
                                    <Option key={4} value = {100}>精通</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    {
                        isEdit && index+1 == skillKeys.length?
                            <Col span={1} offset={1}>
                                <FormItem>
                                    <Button
                                        shape="circle"
                                        size="small"
                                        icon="plus"
                                        type="primary"
                                        onClick={() => this.skillAdd()}
                                    />
                                </FormItem>
                            </Col>
                            :
                            (
                                isEdit &&
                                <Col span={1} offset={1}>
                                    <FormItem>
                                        <Button
                                            shape="circle"
                                            size="small"
                                            icon="minus"
                                            type="primary"
                                            onClick={() => this.skillRemove(item)}
                                        />
                                    </FormItem>
                                </Col>
                            )

                    }
                    {
                        isEdit && index+1 == skillKeys.length && index>0 &&
                        <Col span={1}>
                            <FormItem>
                                <Button
                                    shape="circle"
                                    size="small"
                                    icon="minus"
                                    type="primary"
                                    onClick={() => this.skillRemove(item)}
                                />
                            </FormItem>
                        </Col>
                    }
                </Row>
            )
        });
        const schoolFormItem = schoolKeys.map((item,index)=>{
            return (
                <Row key={index}>
                    <Col span={8}>
                        <FormItem
                            label={index==0?'学校名称':''}
                            {...(index === 0 ? Layout : Layout1)}
                        >
                            {getFieldDecorator(`school_${item}`, {
                                initialValue: !isEdit ? data.school[index].name : school[index][`school_${item}`],
                                rules: [{
                                    required: isEdit,
                                    message: '请输入学校名称!',
                                }],
                            })(
                                <Input disabled={!isEdit} placeholder="请输入学校名称" onChange = {(e)=>this.getInputValue(e.target.value,item,'school','school')}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            label={index==0?'时间':''}
                            {...(index === 0 ? Layout : Layout1)}
                        >
                            {getFieldDecorator(`schoolDate_${item}`, {
                                initialValue: !isEdit ? [moment(data.school[index].time[0]),moment(data.school[index].time[1]) ]: [school[index][`schoolDate_${item}`][0]?moment(school[index][`schoolDate_${item}`][0]):school[index][`schoolDate_${item}`][0],school[index][`schoolDate_${item}`][1]?moment(school[index][`schoolDate_${item}`][1]):school[index][`schoolDate_${item}`][0]],
                                rules: [{
                                    required: isEdit,
                                    message: '请选择入学时间!',
                                }],
                            })(
                                <RangePicker disabled={!isEdit} format="YYYY-MM-DD" onChange = {(data,value)=>this.getInputValue(value,item,'school','schoolDate')}/>
                            )}
                        </FormItem>
                    </Col>
                    {
                        isEdit && index+1 == schoolKeys.length?
                            <Col span={1} offset={1}>
                                <FormItem>
                                    <Button
                                        shape="circle"
                                        size="small"
                                        icon="plus"
                                        type="primary"
                                        onClick={() => this.schoolAdd()}
                                    />
                                </FormItem>
                            </Col>
                            :
                            (
                                isEdit &&
                                <Col span={1} offset={1}>
                                    <FormItem>
                                        <Button
                                            shape="circle"
                                            size="small"
                                            icon="minus"
                                            type="primary"
                                            onClick={() => this.schoolRemove(item)}
                                        />
                                    </FormItem>
                                </Col>
                            )
                    }
                    {
                        isEdit &&  index+1 == schoolKeys.length && index>0 &&
                        <Col span={1}>
                            <FormItem>
                                <Button
                                    shape="circle"
                                    size="small"
                                    icon="minus"
                                    type="primary"
                                    onClick={() => this.schoolRemove(item)}
                                />
                            </FormItem>
                        </Col>
                    }
                </Row>
            )
        });
        const projectFormItem = projectKeys.map((item,index)=>{
            return (
                <Row key={index}>
                    <Col span={6}>
                        <FormItem
                            label={index==0?'项目名称':''}
                            {...(index === 0 ? schoolLayout : schoolLayout1)}
                        >
                            {getFieldDecorator(`project_${item}`, {
                                initialValue: !isEdit ? data.project[index].name : project[index][`project_${item}`],
                                rules: [{
                                    required: isEdit,
                                    message: '请输入项目名称!',
                                }],
                            })(
                                <Input disabled={!isEdit} placeholder="请输入项目名称" onChange = {(e)=>this.getInputValue(e.target.value,item,'project','project')}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            label={index==0?'项目时间':''}
                            {...(index === 0 ? Layout : Layout1)}
                        >
                            {getFieldDecorator(`projectDate_${item}`, {
                                initialValue: !isEdit ?
                                    [moment(data.project[index].time[0]),moment(data.project[index].time[1]) ]
                                    :
                                    [ project[index][`projectDate_${item}`][0] ? moment(project[index][`projectDate_${item}`][0]):project[index][`projectDate_${item}`][0],
                                      project[index][`projectDate_${item}`][1]?moment(project[index][`projectDate_${item}`][1]):project[index][`projectDate_${item}`][1]
                                    ],
                                rules: [{
                                    required: isEdit,
                                    message: '请选择项目时间!',
                                }],
                            })(
                                <RangePicker disabled={!isEdit} format="YYYY-MM-DD" onChange = {(data,value)=>this.getInputValue(value,item,'project','projectDate')}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label={index==0?'项目描述':''}
                            {...(index === 0 ? schoolLayout : schoolLayout1)}
                        >
                            {getFieldDecorator(`projectDec_${item}`, {
                                initialValue: !isEdit ? data.project[index].dec : project[index][`projectDec_${item}`],
                                rules: [{
                                    required: isEdit,
                                    message: '请输入项目描述!',
                                }],
                            })(
                                <Input.TextArea
                                    onChange = {(e)=>this.getInputValue(e.target.value,item,'project','projectDec')}
                                    disabled={!isEdit}
                                    placeholder="请输入项目描述"
                                    autosize = {
                                        {minRows:2, maxRows:4}
                                    }
                                />
                            )}
                        </FormItem>
                    </Col>
                    {
                        isEdit &&  index+1 == projectKeys.length?
                            <Col span={1} offset={1}>
                                <FormItem>
                                    <Button
                                        shape="circle"
                                        size="small"
                                        icon="plus"
                                        type="primary"
                                        onClick={() => this.projectAdd()}
                                    />
                                </FormItem>
                            </Col>
                            :
                            (
                                isEdit &&
                                <Col span={1} offset={1}>
                                    <FormItem>
                                        <Button
                                            shape="circle"
                                            size="small"
                                            icon="minus"
                                            type="primary"
                                            onClick={() => this.projectRemove(item)}
                                        />
                                    </FormItem>
                                </Col>
                            )

                    }
                    {
                        isEdit &&  index+1 == projectKeys.length && index>0 &&
                        <Col span={1}>
                            <FormItem>
                                <Button
                                    shape="circle"
                                    size="small"
                                    icon="minus"
                                    type="primary"
                                    onClick={() => this.projectRemove(item)}
                                />
                            </FormItem>
                        </Col>
                    }
                </Row>
            )
        });

        return(
            <Fragment>
                <Spin tip="请稍后..." spinning = {this.state.spinLoading}>
                    <Form onSubmit={this.onSubmit} >
                        <Row>
                            <Col>
                                <FormItem
                                    {...uploadLayout}
                                >
                                    {
                                        isEdit?
                                            <Upload
                                                listType = "picture-card"
                                                beforeUpload={this.beforeUploadAvatar}
                                                onPreview = {this.handlePreview}
                                                fileList={avatarList}
                                                onRemove  = {this.handleRemovepic}
                                            >
                                                {this.state.avatarList.length>0 ? null : uploadButton}
                                            </Upload>
                                            :
                                            <img src={avatar} style={{width:150,height:150}}/>
                                    }
                                    <Modal visible={previewImgVisible} footer={null} onCancel={this.handleImgCancel}>
                                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                    </Modal>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <FormItem
                                    label='姓名'
                                    {...jobLayout}
                                >
                                    {getFieldDecorator(`name`, {
                                        initialValue: data.name,
                                        rules: [{
                                            required: isEdit,
                                            message: '请输入姓名!',
                                        }],
                                    })(
                                        <Input disabled={!isEdit} placeholder="请输姓名"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    label='出生日期'
                                    {...jobLayout}
                                >
                                    {getFieldDecorator(`age`, {
                                        initialValue: moment(data.age),
                                        rules: [{
                                            required: isEdit,
                                            message: '请选择出生日期!',
                                        }],
                                    })(
                                        <DatePicker disabled={!isEdit} format="YYYY-MM-DD" placeholder="请选择出生日期"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    label='籍贯'
                                    {...jobLayout}
                                >
                                    {getFieldDecorator(`race`, {
                                        initialValue: data.race,
                                        rules: [{
                                            required: isEdit,
                                            message: '请选择籍贯!',
                                        }],
                                    })(
                                        <Select
                                            showSearch
                                            disabled={!isEdit}
                                            placeholder='请选择籍贯,或输入籍贯名称'
                                        >
                                            {
                                                Race.race.map((item,index)=>{
                                                    return <Option key={index} value = {item.id}>{item.name}</Option>

                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    label='性别'
                                    {...jobLayout}
                                >
                                    {getFieldDecorator(`sex`, {
                                        initialValue: data.sex,
                                        rules: [{
                                            required: isEdit,
                                            message: '请选择性别!',
                                        }],
                                    })(
                                        <RadioGroup disabled={!isEdit}>
                                            <Radio value={'1'}>男</Radio>
                                            <Radio value={'2'}>女</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <FormItem
                                    label='职位'
                                    {...jobLayout}
                                >
                                    {getFieldDecorator(`position`, {
                                        initialValue: data.job.position,
                                        rules: [{
                                            required: isEdit,
                                            message: '请输入职位!',
                                        }],
                                    })(
                                        <Input disabled={!isEdit} placeholder="请输入职位"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    label='地点'
                                    {...jobLayout}
                                >
                                    {getFieldDecorator(`workingPlace`, {
                                        initialValue: data.job.workingPlace,
                                        rules: [{
                                            required: isEdit,
                                            message: '请输入工作地点!',
                                        }],
                                    })(
                                        <Input disabled={!isEdit} placeholder="请输入工作地点"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    label='薪资'
                                    {...jobLayout}
                                >
                                    {getFieldDecorator(`salary`, {
                                        initialValue: data.job.salary,
                                        rules: [{
                                            required: isEdit,
                                            message: '请输入薪资!',
                                        }],
                                    })(
                                        <Input disabled={!isEdit} placeholder="请输入薪资"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    label='类别'
                                    {...jobLayout}
                                >
                                    {getFieldDecorator(`status`, {
                                        initialValue: data.job.status,
                                        rules: [{
                                            required: isEdit,
                                            message: '请选择职位类别!',
                                        }],
                                    })(
                                        <RadioGroup disabled={!isEdit}>
                                            <Radio value={1}>全职</Radio>
                                            <Radio value={2}>兼职</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem
                                    label='学历'
                                    {...Layout}
                                >
                                    {getFieldDecorator(`education`, {
                                        initialValue: data.education,
                                        rules: [{
                                            required: isEdit,
                                            message: '请选择学历!',
                                        }],
                                    })(
                                        <Select placeholder='请选择学历' disabled={!isEdit}>
                                            <Option key={1} value = '小学'>小学</Option>
                                            <Option key={2} value = '高中'>高中</Option>
                                            <Option key={3} value = '专科'>专科</Option>
                                            <Option key={4} value = '本科'>本科</Option>
                                            <Option key={4} value = '硕士'>硕士</Option>
                                            <Option key={6} value = '博士'>博士</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label='专业'
                                    {...Layout}
                                >
                                    {getFieldDecorator(`major`, {
                                        initialValue: data.major,
                                    })(
                                        <Input disabled={!isEdit} placeholder="请输入专业"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label='兴趣'
                                    {...Layout}
                                >
                                    {getFieldDecorator(`interest`, {
                                        initialValue: this.state.interest,
                                        rules: [{
                                            required: isEdit,
                                            message: '请输入兴趣,以‘、’隔开!',
                                        }],
                                    })(
                                        <Input disabled={!isEdit} placeholder="请输入兴趣,以‘、’隔开"/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem
                                    label='手机号码'
                                    {...Layout}
                                >
                                    {getFieldDecorator(`phone`, {
                                        initialValue: data.phone,
                                        rules: [{
                                            required: isEdit,
                                            message: '请输入手机号码!',
                                        }, {
                                            validator: this.validatePhone,
                                        }],
                                    })(
                                        <Input disabled={!isEdit} placeholder="请输入手机号码"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label='Email'
                                    {...Layout}
                                >
                                    {getFieldDecorator(`email`, {
                                        initialValue: data.email,
                                        rules: [{
                                            type: 'email', message: '输入的不是EMAIL地址!',
                                        }, {
                                            required: isEdit, message: '请输入EMAIL地址!',
                                        }],
                                    })(
                                        <Input disabled={!isEdit} placeholder="请输入email账号"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                        label='QQ'
                                    {...Layout}
                                >
                                    {getFieldDecorator(`qq`, {
                                        initialValue: data.qq,
                                    })(
                                        <Input disabled={!isEdit} placeholder="请输入QQ账号"/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <div style={{
                            border: '1px solid rgba(0, 0, 0, 0.016)',
                            boxShadow: 'rgb(64, 169, 255) 0px 1px 20px',
                            marginTop:0,
                            marginBottom:20,
                            paddingTop:20
                        }}>
                            {skillFormItem}
                        </div>
                        <div style={{
                            border: '1px solid rgba(0, 0, 0, 0.016)',
                            boxShadow: 'rgb(255, 64, 64) 0px 1px 20px',
                            marginTop:0,
                            marginBottom:20,
                            paddingTop:20
                        }}>
                            {schoolFormItem}
                        </div>
                        <div style={{
                            border: '1px solid rgba(0, 0, 0, 0.016)',
                            boxShadow: 'rgb(76, 64, 255) 0px 1px 20px',
                            marginTop:0,
                            marginBottom:20,
                            paddingTop:20
                        }}>
                            {projectFormItem}
                        </div>
                        <Row>
                            <Col span={24}>
                                <FormItem
                                    label='自我评价'
                                    {...meLayout}
                                >
                                    {getFieldDecorator(`evaluation`, {
                                        initialValue: data.evaluation,
                                        rules: [{
                                            required: isEdit,
                                            message: '请输入自我评价!',
                                        }],
                                    })(
                                        <Input.TextArea
                                            disabled={!isEdit}
                                            placeholder="请输入自我介绍"
                                            autosize = {
                                                {minRows:4, maxRows:8}
                                            }
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row >
                            {isEdit &&
                            <Col span={22}>
                                <FormItem>
                                    <Button type="primary" htmlType="submit">保存</Button>
                                </FormItem>
                            </Col>
                            }
                            <Col span={2}>
                                <FormItem>
                                    <Button type="primary" style = {{float:"right"}} onClick={isEdit?this.EditHandel:this.Edit}>{isEdit?'取消':'编辑'}</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
                <Modal
                    visible={this.state.CropperVisible}
                    width = {800}
                    closable = {false}
                    footer={[
                        <Button key="handle" onClick={this.handleCancelCropper}>取消</Button>,
                        <Button key="ok" type="primary" onClick={this.ImgSaveCropper}>确认</Button>
                    ]}
                >
                    <Cropper
                        src={this.state.srcCropper} //图片路径，即是base64的值，在Upload上传的时候获取到的
                        style={{ height: 400 }}
                        viewMode={1} //定义cropper的视图模式
                        zoomable={true} //是否允许放大图像
                        aspectRatio={16/16} //image的纵横比
                        guides={true} //显示在裁剪框上方的虚线
                        background={false} //是否显示背景的马赛克
                        rotatable={false} //是否旋转
                        crop={this._crop.bind(this)}
                        ref='cropper'           //必须指定这个，不然不去不到getCroppedCanvas（）方法
                    />
                </Modal>
            </Fragment>
        )
    }

    //获取值 要不然取消编辑后数据没有清空
    getInputValue = (value,index,type,typeValue ) =>{
        if(type === 'sill'){
            const { sill } = this.state;
            sill.filter(key => {
                //获取对象key的第一个key
                let keyArr = Object.keys(key)[0].split('_')[1];        //取最后的数值
                if(index == Number(keyArr)){
                    key[`${typeValue}_${index}`] = value
                }
            });
            this.setState({
                sill
            })
        }
        if(type === 'school'){
            const { school } = this.state;
            school.filter(key => {
                //获取对象key的第一个key
                let keyArr = Object.keys(key)[0].split('_')[1];        //取最后的数值
                if(index == Number(keyArr)){
                    key[`${typeValue}_${index}`] = value
                }
            });
            this.setState({
                school
            })
        }
        if(type === 'project'){
            const { project } = this.state;
            project.filter(key => {
                //获取对象key的第一个key
                let keyArr = Object.keys(key)[0].split('_')[1];        //取最后的数值
                if(index == Number(keyArr)){
                    key[`${typeValue}_${index}`] = value
                }
            });
            this.setState({
                project
            })
        }
    };

    //点击取消返回数据对应的动态表格数组
    sillFormDataChange = (type,data,value) =>{
        const { form } = this.props;
        let newData = [];
        sillId = 0;
        data.sill.map((item,index)=>{
            const sillKeys = form.getFieldValue('sillkeys');
            const nextKeys = sillKeys.concat(++index);
            sillId = index;
            form.setFieldsValue({
                sillkeys: nextKeys,
            });
        });
        if(type == 'add'){
            let sillfromKey = form.getFieldValue('sillkeys');
            sillfromKey.map((item,index)=>{
                let keyN = `name_${item}`;
                let keyV = `pre_${item}`;
                newData.push({
                    [keyN]:data.sill[index].name,
                    [keyV]:data.sill[index].pre
                });
            })
        } else {
            for(let i=0;i< value; i++){
                const sillKeys = form.getFieldValue('sillkeys');
                form.setFieldsValue({
                    sillkeys: sillKeys.filter(key => key !== sillKeys[sillKeys.length-1]),
                });
            }
            let sillfromKey = form.getFieldValue('sillkeys');
            sillfromKey.map((item,index)=>{
                let keyN = `name_${item}`;
                let keyV = `pre_${item}`;
                newData.push({
                    [keyN]:data.sill[index].name,
                    [keyV]:data.sill[index].pre
                });
            });
        }
        this.setState({
            sill:newData
        })
    };

    schoolFormDataChange = (type,data,value) =>{
        const { form } = this.props;
        schoolId =0;
        data.school.map((item,index)=>{
            const schoolKeys = form.getFieldValue('schoolkeys');
            const nextKeys = schoolKeys.concat(++index);
            schoolId = index;
            form.setFieldsValue({
                schoolkeys: nextKeys,
            });
        });
        let newData = [];
        if(type == 'add'){
            let schoolfromKey = form.getFieldValue('schoolkeys');
            schoolfromKey.map((item,index)=>{
                let keyN = `school_${item}`;
                let keyV = `schoolDate_${item}`;
                newData.push({
                    [keyN]:data.school[index].name,
                    [keyV]:data.school[index].time
                });
            })
        } else {
            for(let i=0;i< value; i++){
                const schoolKeys = form.getFieldValue('schoolkeys');
                form.setFieldsValue({
                    schoolkeys: schoolKeys.filter(key => key !== schoolKeys[schoolKeys.length-1]),
                });
            }
            let schoolfromKey = form.getFieldValue('schoolkeys');
            schoolfromKey.map((item,index)=>{
                let keyN = `school_${item}`;
                let keyV = `schoolDate_${item}`;
                newData.push({
                    [keyN]:data.school[index].name,
                    [keyV]:data.school[index].time
                });
            });
        }
        this.setState({
            school:newData
        })
    };

    projectFormDataChange = (type,data,value) =>{
        const { form } = this.props;
        let newData = [];
        projectId = 0;
        data.project.map((item,index)=>{
            const projectKeys = form.getFieldValue('projectkeys');
            const nextKeys = projectKeys.concat(++index);
            projectId = index;
            form.setFieldsValue({
                projectkeys: nextKeys,
            });
        });
        if(type == 'add'){
            let projectfromKey = form.getFieldValue('projectkeys');
            projectfromKey.map((item,index)=>{
                let keyP = `project_${item}`;
                let keyD = `projectDate_${item}`;
                let keyE = `projectDec_${item}`;
                newData.push({
                    [keyP]:data.project[index].name,
                    [keyD]:data.project[index].time,
                    [keyE]:data.project[index].dec
                });
            })
        } else {
            for(let i=0;i< value; i++){
                const projectKeys = form.getFieldValue('projectkeys');
                form.setFieldsValue({
                    projectkeys: projectKeys.filter(key => key !== projectKeys[projectKeys.length-1]),
                });
            }
            let projectfromKey = form.getFieldValue('projectkeys');
            projectfromKey.map((item,index)=>{
                let keyP = `project_${item}`;
                let keyD = `projectDate_${item}`;
                let keyE = `projectDec_${item}`;
                newData.push({
                    [keyP]:data.project[index].name,
                    [keyD]:data.project[index].time,
                    [keyE]:data.project[index].dec
                });
            });
        }
        this.setState({
            project:newData
        })
    };
    //开始编辑
    Edit = () =>{
        this.setState({
            isEdit:true
        })
    };
    //取消编辑
    EditHandel = () =>{
        const { form,data } = this.props;
        form.resetFields();
        let sillData = data.sill;
        let schoolData = data.school;
        let projectData = data.project;

        const sillKeys = form.getFieldValue('sillkeys');
        const schoolKeys = form.getFieldValue('schoolkeys');
        const projectKeys = form.getFieldValue('projectkeys');

        if (sillData.length > sillKeys.length){
            let value = sillData.length - sillKeys.length;
            this.sillFormDataChange('add',data,value)
        } else {
            let value = sillKeys.length - sillData.length;
            this.sillFormDataChange('remove',data,value);
        }

        if (schoolData.length > schoolKeys.length){
            let value = schoolData.length - schoolKeys.length;
            this.schoolFormDataChange('add',data,value)
        } else {
            let value = schoolKeys.length - schoolData.length;
            this.schoolFormDataChange('remove',data,value);
        }
        if (projectData.length > projectKeys.length){
            let value = projectData.length - projectKeys.length;
            this.projectFormDataChange('add',data,value)
        } else {
            let value = projectKeys.length - projectData.length;
            this.projectFormDataChange('remove',data,value);
        }
        this.setState({
            avatar:data.avatar,
            isEdit:false
        })
    }
}

ShowAndEditResume = Form.create()(ShowAndEditResume);
export default ShowAndEditResume
