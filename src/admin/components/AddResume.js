import React,{ Component } from 'react';
import {Upload,Icon,message,Form, Row, Col,Input,Button,Modal,Spin,Radio,DatePicker,Select} from 'antd'
import {getUser} from '../../auth';
import moment from 'moment';
import Cropper from 'react-cropper';
import Race from '../../static/data/Race.json'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const Fragment = React.Fragment;
const { RangePicker } = DatePicker;


const fileShowUrl = 'http://localhost:5000/api/upload/img';

let sillId = 0; //新增技能是使用的id
let shcoolId =0;
let projectId =0;
class AddResume extends Component{

    constructor(props){
        super(props);
        this.state = {
            avatarList:[],
            avatar:'',
            previewImage:'',
            previewImgVisible:false,
            //裁剪相关设置
            srcCropper:'',
            selectImgName:'',
            selectImgSize:0,
            selectImgSuffix:'',
            CropperVisible:false,

            loading:false
        };
        this.user = getUser();
    }

    componentDidMount(){
        this.skillAdd();
        this.schoolAdd();
        this.projectAdd();
    }


    projectAdd = () =>{
        const { form } = this.props;
        const projectKeys = form.getFieldValue('projectKeys');
        const nextKeys = projectKeys.concat(++projectId);
        form.setFieldsValue({
            projectKeys: nextKeys,
        });
    };
    projectRemove = (k) =>{
        const { form } = this.props;
        const projectKeys = form.getFieldValue('projectKeys');
        form.setFieldsValue({
            projectKeys: projectKeys.filter(key => key !== k),
        });
    };

    schoolAdd = () =>{
        const { form } = this.props;
        const schoolKeys = form.getFieldValue('schoolKeys');
        const nextKeys = schoolKeys.concat(++shcoolId);
        form.setFieldsValue({
            schoolKeys: nextKeys,
        });
    };
    schoolRemove = (k) =>{
        const { form } = this.props;
        const schoolKeys = form.getFieldValue('schoolKeys');
        form.setFieldsValue({
            schoolKeys: schoolKeys.filter(key => key !== k),
        });
    };

    skillAdd = () =>{
        const { form } = this.props;
        const skillKeys = form.getFieldValue('skillKeys');
        const nextKeys = skillKeys.concat(++sillId);
        form.setFieldsValue({
            skillKeys: nextKeys,
        });
    };
    //联系方式删除表格
    skillRemove = (k) =>{
        const { form } = this.props;
        const skillKeys = form.getFieldValue('skillKeys');
        form.setFieldsValue({
            skillKeys: skillKeys.filter(key => key !== k),
        });
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
    render () {
        let self = this;
        const { getFieldDecorator,getFieldValue  } = self.props.form;
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
        getFieldDecorator('skillKeys', { initialValue: [] });
        const skillKeys = getFieldValue('skillKeys');
        //学校
        getFieldDecorator('schoolKeys', { initialValue: [] });
        const schoolKeys = getFieldValue('schoolKeys');

        getFieldDecorator('projectKeys', { initialValue: [] });
        const projectKeys = getFieldValue('projectKeys');

        const skillFormItem = skillKeys.map((item,index)=>{
            return (
                <Row key={index}>
                    <Col span={8}>
                        <FormItem
                            label={index==0?'技能':''}
                            {...(index === 0 ? Layout : Layout1)}
                        >
                            {getFieldDecorator(`sill_${item}`, {
                                rules: [{
                                    required: true,
                                    message: '请输入技能!',
                                }],
                            })(
                                <Input placeholder="请输入技能"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            label={index==0?'熟练度':''}
                            {...(index === 0 ? Layout : Layout1)}
                        >
                            {getFieldDecorator(`pre_${item}`, {
                                rules: [{
                                    required: true,
                                    message: '请选择熟练度!',
                                }],
                            })(
                                <Select
                                    placeholder='请选择熟练度'
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
                        index+1 == skillKeys.length?
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
                    }
                    {
                        index+1 == skillKeys.length && index>0 &&
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
                                rules: [{
                                    required: true,
                                    message: '请输入学校名称!',
                                }],
                            })(
                                <Input placeholder="请输入学校名称"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            label={index==0?'时间':''}
                            {...(index === 0 ? Layout : Layout1)}
                        >
                            {getFieldDecorator(`schoolDate_${item}`, {
                                rules: [{
                                    required: true,
                                    message: '请选择入学时间!',
                                }],
                            })(
                                <RangePicker format="YYYY-MM-DD"/>
                            )}
                        </FormItem>
                    </Col>
                    {
                        index+1 == schoolKeys.length?
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
                    }
                    {
                        index+1 == schoolKeys.length && index>0 &&
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
                                rules: [{
                                    required: true,
                                    message: '请输入项目名称!',
                                }],
                            })(
                                <Input placeholder="请输入项目名称"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            label={index==0?'项目时间':''}
                            {...(index === 0 ? Layout : Layout1)}
                        >
                            {getFieldDecorator(`projectDate_${item}`, {
                                rules: [{
                                    required: true,
                                    message: '请选择项目时间!',
                                }],
                            })(
                                <RangePicker format="YYYY-MM-DD"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label={index==0?'项目描述':''}
                            {...(index === 0 ? schoolLayout : schoolLayout1)}
                        >
                            {getFieldDecorator(`projectDec_${item}`, {
                                rules: [{
                                    required: true,
                                    message: '请输入项目描述!',
                                }],
                            })(
                                <Input.TextArea
                                    placeholder="请输入项目描述"
                                    autosize = {
                                        {minRows:2, maxRows:4}
                                    }
                                />
                            )}
                        </FormItem>
                    </Col>
                    {
                        index+1 == projectKeys.length?
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
                    }
                    {
                        index+1 == projectKeys.length && index>0 &&
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
                <Spin tip="数据提交中,主人耐心等待..." spinning = {this.state.loading}>
                    <Form onSubmit={this.onSubmit} >
                        <Row>
                            <Col>
                                <FormItem
                                    {...uploadLayout}
                                >
                                    <Upload
                                        listType = "picture-card"
                                        beforeUpload={this.beforeUploadAvatar}
                                        onPreview = {this.handlePreview}
                                        fileList={this.state.avatarList}
                                        onRemove  = {this.handleRemovepic}
                                    >
                                        {this.state.avatarList.length>0 ? null : uploadButton}
                                    </Upload>
                                    <Modal visible={this.state.previewImgVisible} footer={null} onCancel={this.handleImgCancel}>
                                        <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
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
                                        rules: [{
                                            required: true,
                                            message: '请输入姓名!',
                                        }],
                                    })(
                                        <Input placeholder="请输姓名"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    label='出生日期'
                                    {...jobLayout}
                                >
                                    {getFieldDecorator(`age`, {
                                        rules: [{
                                            required: true,
                                            message: '请选择出生日期!',
                                        }],
                                    })(
                                        <DatePicker format="YYYY-MM-DD" placeholder="请选择出生日期"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    label='籍贯'
                                    {...jobLayout}
                                >
                                    {getFieldDecorator(`race`, {
                                        rules: [{
                                            required: true,
                                            message: '请选择籍贯!',
                                        }],
                                    })(
                                        <Select
                                            showSearch
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
                                        rules: [{
                                            required: true,
                                            message: '请选择性别!',
                                        }],
                                    })(
                                        <RadioGroup>
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
                                        rules: [{
                                            required: true,
                                            message: '请输入职位!',
                                        }],
                                    })(
                                        <Input placeholder="请输入职位"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    label='地点'
                                    {...jobLayout}
                                >
                                    {getFieldDecorator(`workingPlace`, {
                                        rules: [{
                                            required: true,
                                            message: '请输入工作地点!',
                                        }],
                                    })(
                                        <Input placeholder="请输入工作地点"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    label='薪资'
                                    {...jobLayout}
                                >
                                    {getFieldDecorator(`salary`, {
                                        rules: [{
                                            required: true,
                                            message: '请输入薪资!',
                                        }],
                                    })(
                                        <Input placeholder="请输入薪资"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    label='类别'
                                    {...jobLayout}
                                >
                                    {getFieldDecorator(`status`, {
                                        rules: [{
                                            required: true,
                                            message: '请选择职位类别!',
                                        }],
                                    })(
                                        <RadioGroup>
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
                                        rules: [{
                                            required: true,
                                            message: '请选择学历!',
                                        }],
                                    })(
                                        <Select placeholder='请选择学历'>
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
                                        //rules: [{required: true, message: '请输入专业!',}],
                                    })(
                                        <Input placeholder="请输入专业"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label='兴趣'
                                    {...Layout}
                                >
                                    {getFieldDecorator(`interest`, {
                                        rules: [{
                                            required: true,
                                            message: '请输入兴趣,以‘、’隔开!',
                                        }],
                                    })(
                                        <Input placeholder="请输入兴趣,以‘、’隔开"/>
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
                                        rules: [{
                                            required: true,
                                            message: '请输入手机号码!',
                                        }, {
                                            validator: this.validatePhone,
                                        }],
                                    })(
                                        <Input  placeholder="请输入手机号码"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label='Email'
                                    {...Layout}
                                >
                                    {getFieldDecorator(`email`, {
                                        rules: [{
                                            type: 'email', message: '输入的不是EMAIL地址!',
                                        }, {
                                            required: true, message: '请输入EMAIL地址!',
                                        }],
                                    })(
                                        <Input placeholder="请输入email账号"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label='QQ'
                                    {...Layout}
                                >
                                    {getFieldDecorator(`qq`, {
                                    })(
                                        <Input  placeholder="请输入QQ账号"/>
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
                                        rules: [{
                                            required: true,
                                            message: '请输入自我评价!',
                                        }],
                                    })(
                                        <Input.TextArea
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
                            <Col>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" style = {{float:"right"}}>保存</Button>
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
                        aspectRatio={9/16} //image的纵横比
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
    onSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.setState({
                    loading:true
                });
                let job = {
                    position:values.position,
                    workingPlace:values.workingPlace,
                    salary:values.salary,
                    status:values.status
                };
                let sill = [];
                values.skillKeys.map(item=>{
                    sill.push({
                        name:values[`sill_${item}`],
                        pre:values[`pre_${item}`]
                    })
                });
                let school =[];
                values.schoolKeys.map(item=>{
                    school.push({
                        time:[moment(values[`schoolDate_${item}`][0]).format('YYYY-MM-DD'),moment(values[`schoolDate_${item}`][1]).format('YYYY-MM-DD')],
                        name:values[`school_${item}`]
                    })
                });
                let project = [];
                values.projectKeys.map(item=>{
                    project.push({
                        time:[moment(values[`projectDate_${item}`][0]).format('YYYY-MM-DD'),moment(values[`projectDate_${item}`][1]).format('YYYY-MM-DD')],
                        name:values[`project_${item}`],
                        dec:values[`projectDec_${item}`]
                    })
                });
                let subData = {
                    userId:this.user.userId,
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
                fetch(`/api/resume/add`,{
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
                        this.props.form.resetFields();
                        this.setState({
                            loading:false,
                            avatar:'',
                            avatarList:[]
                        });
                        this.skillAdd();
                        this.schoolAdd();
                        this.projectAdd();
                        this.props.getUserResume();
                        message.success('新增成功');
                    } else {
                        this.setState({
                            loading:false
                        });
                        message.error(json.msg)
                    }
                })
            }
        })
    }
}

AddResume = Form.create()(AddResume);
export default AddResume
