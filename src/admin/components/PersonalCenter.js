/**
 * Created by mahai on 2018/12/10.
 */
import React,{Component} from "react";
import {getUser} from '../../auth';
import '../styles/personcenter.css';
import {Row, Col,Input,Form,Spin,Button,Upload,Icon,message,Modal,Radio} from 'antd';
import Cropper from 'react-cropper';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const fileShowUrl = 'http://www.mayunyi.top:5000/api/upload/img';

class PersonalCenter extends  Component {

    constructor(props){
        super(props);
        this.state = {
            loading:false,
            previewImgVisible:false,
            previewImage:'',
            avatar:'',
            phone:'',
            name:'',
            sex:1,
            avatarList:[],
            //裁剪相关设置
            srcCropper:'',
            selectImgName:'',
            selectImgSize:0,
            selectImgSuffix:'',
            CropperVisible:false,
            isEdit:false,
        };
        this.user = getUser();
    }

    componentDidMount(){
        if(this.user.userId){
            this.getUserInfo()
        }
    }

    getUserInfo(){
        //获取用户信息数据
        fetch(`/api/users/find/${this.user.userId}`).then(rep=>{
            return rep.json()
        }).then(json=>{
            if(json.status === 2) {
                this.setState({
                    avatar:json.data.avatar,
                    name:json.data.name,
                    phone:json.data.extra_params.phone || '',
                    sex:json.data.extra_params.sex || 1,
                })
            }
        })
    }


    handleImgCancel = () => this.setState({ previewImgVisible: false });

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

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewImgVisible: true,
        });
    };
    handleRemovepic = (file) =>this.setState({ previewImage: '',avatarList:[],avatar:'' });

    render() {
        let self = this;
        const { getFieldDecorator } = self.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        };
        const uploadLayout = {
            wrapperCol: {
                sm: { span: 8, offset: 10 },
            },
        };
        const { loading,avatarList,previewImgVisible,previewImage,isEdit,sex,phone,name,avatar } = self.state;
        const uploadButton = (
            <div>
                <Icon type='plus' />
                <div className="ant-upload-text">上传头像</div>
            </div>
        );
        return (
            <Spin tip="个人信息保存中..." spinning={loading}>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col>
                            <FormItem
                                {...uploadLayout}
                            >
                                {
                                    isEdit ?
                                        <Upload
                                            listType = "picture-card"
                                            beforeUpload={this.beforeUploadAvatar}
                                            onPreview = {this.handlePreview}
                                            fileList={avatarList}
                                            onRemove  = {this.handleRemovepic}
                                        >
                                            {avatarList.length>0 ? null : uploadButton}
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
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="用户名"
                            >
                                {getFieldDecorator('name', {
                                    initialValue: name || '',
                                    rules: [{
                                        required: true, message: '请输入用户名!',
                                    },{
                                        validator: this.checkValidator
                                    }],
                                })(
                                    <Input disabled={!isEdit} placeholder="请输入用户名"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="性别"
                            >
                                {getFieldDecorator('sex', {
                                    initialValue: sex || 1,
                                    rules: [{
                                        required: true, message: '请选择性别!',
                                    }],
                                })(
                                    <RadioGroup disabled={!isEdit}>
                                        <Radio value={1}>男</Radio>
                                        <Radio value={2}>女</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="手机号码"
                            >
                                {getFieldDecorator('phone', {
                                    initialValue: phone || '',
                                    rules: [{
                                        validator: this.checkValidator
                                    }],
                                })(
                                    <Input disabled={!isEdit} placeholder="请输入手机号码"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                    {
                        isEdit ?
                            <Row>
                                <Col span={2}>
                                    <FormItem>
                                        <Button type="primary" onClick={this.handleCancel}>取消</Button>
                                    </FormItem>
                                </Col>
                                <Col span={2} offset={20}>
                                    <FormItem>
                                        <Button type="primary" htmlType="submit">保存</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                            :
                            <Row>
                                <Col span={2} offset={22}>
                                    <FormItem>
                                        <Button type="primary" onClick={this.onEdit}>编辑</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                    }

                    <Modal
                        visible={this.state.CropperVisible}
                        width = {800}
                        closable = {false}
                        footer={[
                            <Button key="ok" type="primary" onClick={this.ImgSaveCropper}>确认</Button>,
                            <Button key="handle" onClick={this.handleCancelCropper}>取消</Button>
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
                </Form>
            </Spin>
        )
    }

    handleCancel = () =>{
        this.setState({
            isEdit:false
        });
        this.getUserInfo()
    };

    onEdit = () =>{
        this.setState({
            isEdit:true
        })
    };

    _crop(){
        const croppedCanvas = this.refs.cropper.getCroppedCanvas({
            minWidth: 200,
            minHeight: 200,
            // width: 200,
            // height: 200,
            // maxWidth: 200,
            // maxHeight: 200
        });

        croppedCanvas.toBlob(async blob => {
            if(blob){
                // 图片name添加到blob对象里
                let timestamp = Date.parse(new Date());
                blob.name = timestamp + '.jpeg';
                // blob.name = this.state.selectImgName;
                // 创建提交表单数据对象
                const filedata = new FormData();
                // 添加要上传的文件
                filedata.append('file', blob, blob.name);
                this.setState({
                    imgData:filedata
                });
            }
        }, "image/jpeg");
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
    handleSubmit = (e) =>{
        e.preventDefault();
        if(!this.user.userId){
            return message.error('请登录账号！')
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let userInfo = {
                    name:values.name,
                    avatar:this.state.avatar,
                    extra_params:{
                        sex:values.sex,
                        phone:values.phone
                    }
                };
                this.setState({
                    loading:true
                });
                fetch(`/api/users/edit/${this.user.userId}`,{
                    method:"POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":getUser().token
                    },
                    body:  JSON.stringify(userInfo)
                }).then(rep=>{
                    return rep.json()
                }).then(json=>{
                    if(json.status === 2){
                        this.setState({
                            loading:false,
                            isEdit:false,
                            avatar:json.data.avatar,
                            name:json.data.name,
                            phone:json.data.extra_params.phone || '',
                            sex:json.data.extra_params.sex || 1,
                        })
                    }
                })

            }
        })
    };
    //自定义校验规则
    checkValidator = (rule, value, callback) =>{
        const { fullField } = rule;
        switch(fullField){
            case 'phone':
                if(!(/^1[34578]\d{9}$/.test(value)) && value){
                    callback('请输入有效的手机号码')
                }
                callback();
                break;
            case 'name':
                if((value.length > 15 || value.length < 2) && value){
                    callback('用户名称长度在2~15之间(包含2和15)')
                }
                callback();
                break;
            // case 'loginNubmer':
            //     if(!(/^[a-zA-Z][a-zA-Z0-9]{3,15}$/.test(value)) && value){
            //         callback('用户名由英文字母和数字组成的4-16位字符，以字母开头')
            //     }
            //     break;
            default:
                callback()
        }
    }
}
PersonalCenter = Form.create()(PersonalCenter);
export default PersonalCenter

