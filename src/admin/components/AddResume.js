import React,{ Component } from 'react';
import {Upload,Icon,message,Form, Row, Col,Input,Button,Modal,Spin,Radio,DatePicker,Select} from 'antd'
import {getUser} from '../../auth';
import Cropper from 'react-cropper';
import Race from '../../static/data/Race.json'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const Fragment = React.Fragment;

const fileShowUrl = 'http://localhost:5000/api/upload/img';

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

        }
    }

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
        const uploadButton = (
            <div>
                <Icon type='plus' />
                <div className="ant-upload-text">上传头像</div>
            </div>
        );
        return(
            <Fragment>
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
                                label='年龄'
                                {...jobLayout}
                            >
                                {getFieldDecorator(`age`, {
                                    rules: [{
                                        required: true,
                                        message: '请选择日期!',
                                    }],
                                })(
                                    <DatePicker placeholder="请选择出生日期"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem
                                label='种族'
                                {...jobLayout}
                            >
                                {getFieldDecorator(`race`, {
                                    rules: [{
                                        required: true,
                                        message: '请选择种族!',
                                    }],
                                })(
                                    <Select
                                        showSearch
                                        placeholder='请选择种族,或输入种族名称'
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
                                        <Radio value={1}>男</Radio>
                                        <Radio value={2}>女</Radio>
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
                                        message: '请输入学历!',
                                    }],
                                })(
                                    <Input placeholder="请输入学历"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                label='专业'
                                {...Layout}
                            >
                                {getFieldDecorator(`major`, {
                                    rules: [{
                                        required: true,
                                        message: '请输入专业!',
                                    }],
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
                </Form>
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
}

AddResume = Form.create()(AddResume);
export default AddResume