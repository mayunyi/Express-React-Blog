
import React, { Component } from 'react';
import {Table,Upload,Icon,message,Form, Row, Col,Select,Input,Button,Modal} from 'antd'
import {getUser} from '../../auth';
import Cropper from 'react-cropper';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const Fragment = React.Fragment;

const fileShowUrl = 'http://localhost:5000/api/upload/img';
let id = 0;
let mrId = 0;
class EditAbout extends Component{
    constructor(props){
        super(props);
        this.state = {
            contact:[], //
            isEdit:true,
            avatar:'',
            previewImgVisible:false,
            previewImage:'',
            avatarList:[],
            //裁剪相关设置
            srcCropper:'',
            selectImgName:'',
            selectImgSize:0,
            selectImgSuffix:'',
            CropperVisible:false,
        }
    }
    componentDidMount(){
        this.add();
        this.mradd()
    }

    onSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let contactKey =  values.keys;
                let mrkeys = values.mrkeys;
                let contactArr = [];
                let mrArr = [];
                contactKey.map(item=>{
                    contactArr.push({
                        contact_name:values[`contact_name_${item}`],
                        contact_number:values[`contact_number_${item}`],
                    })
                });
                mrkeys.map(item=>{
                    mrArr.push(values[`WellknownSaying_${item}`])
                });
                let avatar = this.state.avatar;

                let submitData = {
                    userId:getUser().userId,
                    contact:contactArr,
                    dec:values.dec,
                    img:avatar,
                    WellknownSaying:mrArr
                };
                fetch(`/api/about/add`,{
                    method:"POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":getUser().token
                    },
                    body:  JSON.stringify(submitData)
                }).then(rep=>{
                    return rep.json()
                }).then(json=>{
                    if(json.status === 2){
                        message.success('新增成功')
                    }
                })


            }
        })
    };


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
        const { isEdit,avatar,previewImgVisible,previewImage,avatarList } = self.state;
        const Layout = {
            labelCol: {span: 12},
            wrapperCol: {span: 12}
        };
        const Layout1 = {
            labelCol: {span: 12},
            wrapperCol: {span: 12,offset:12}
        };

        const mrLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 17}
        };
        const mrLayout1 = {
            labelCol: {span: 6},
            wrapperCol: {span: 17,offset:6}
        };
        const decLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 14}
        };
        const uploadLayout = {
            wrapperCol: {
                sm: { span: 8, offset: 10 },
            },
        };
        const uploadButton = (
            <div>
                <Icon type='plus' />
                <div className="ant-upload-text">上传头像</div>
            </div>
        );

        getFieldDecorator('keys', { initialValue: [] });
        getFieldDecorator('mrkeys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const mrkeys = getFieldValue('mrkeys');
        //联系方式
        const formItems = keys.map((item,index)=> {
            return (
                <Row key ={index}>
                    <Col span={4}>
                        <FormItem
                            {...(index === 0 ? Layout : Layout1)}
                            label={index === 0 ? '联系方式' : ''}
                            required={false}
                            key={index}
                        >
                            {getFieldDecorator(`contact_name_${item}`, {
                                rules: [{
                                    required: true,
                                    message: '请输入联系方式!',
                                }],
                            })(
                                <Input
                                    placeholder="请输入联系方式"
                                />,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4} offset={1}>
                        <Row>
                            <Col span={16}>
                                <FormItem>
                                    {getFieldDecorator(`contact_number_${item}`, {
                                        rules: [{
                                            required: true,
                                            message: '请输入联系号码!',
                                        }],
                                    })(
                                        <Input
                                            placeholder="请输入联系号码"
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                            {
                                index < 2 &&
                                <Col span={2} offset={1}>
                                    {
                                        0< keys.length < 2 && index+1 == keys.length  ?
                                            <FormItem>
                                                <Button shape="circle" size="small" icon="plus" type="primary"
                                                        onClick={() => this.add()}/>
                                            </FormItem>
                                            :
                                            <FormItem>
                                                <Button shape="circle" size="small" icon="minus" type="primary"
                                                        onClick={() => this.remove(item)}/>
                                            </FormItem>
                                    }
                                </Col>
                            }
                            {
                                index+1 == keys.length && index>0 &&
                                <Col span={2} offset={1}>
                                    <FormItem>
                                        <Button shape="circle" size="small" icon="minus" type="primary"
                                                onClick={() => this.remove(item)}/>
                                    </FormItem>
                                </Col>
                            }
                        </Row>
                    </Col>
                </Row>
            )

        });
        //名言
        const mrItems = mrkeys.map((item,index)=> {
            return (
                <Row key ={index}>
                    <Col span={8}>

                        <FormItem
                            {...(index === 0 ? mrLayout : mrLayout1)}
                            label={index === 0 ? '名言名句' : ''}
                            required={false}
                            key={index}
                        >
                            {getFieldDecorator(`WellknownSaying_${item}`, {
                                rules: [{
                                    required: true,
                                    message: '请输入名言名句!',
                                }],
                            })(
                                <Input
                                    placeholder="请输入名言名句"
                                />,
                            )}
                        </FormItem>
                    </Col>
                    {
                        index < 2 &&
                        <Col span={1}>
                            {
                                0< mrkeys.length < 2 && index+1 == mrkeys.length  ?
                                    <FormItem>
                                        <Button
                                            shape="circle"
                                            size="small"
                                            icon="plus"
                                            type="primary"
                                            onClick={() => this.mradd()}
                                            style={{marginLeft:-10}}
                                        />
                                    </FormItem>
                                    :
                                    <FormItem>
                                        <Button
                                            shape="circle"
                                            size="small"
                                            icon="minus"
                                            type="primary"
                                            onClick={() => this.mrremove(item)}
                                            style={{marginLeft:-10}}
                                        />
                                    </FormItem>
                            }
                        </Col>
                    }
                    {
                        index+1 == mrkeys.length && index>0 &&
                        <Col span={1}>
                            <FormItem>
                                <Button
                                    shape="circle"
                                    size="small"
                                    icon="minus"
                                    type="primary"
                                    style={{marginLeft:mrkeys.length==3?-10:-40}}
                                    onClick={() => this.mrremove(item)}
                                />
                            </FormItem>
                        </Col>
                    }
                </Row>
            )
        });
        return (
            <Fragment>
                <Form onSubmit={this.onSubmit} >
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
                    {formItems}
                    {mrItems}
                    <Row>
                        <Col>
                            <FormItem
                                {... decLayout}
                                label='自我介绍'
                            >
                                {getFieldDecorator(`dec`, {
                                    rules: [{
                                        required: true,
                                        message: '请输入自我介绍!',
                                    }],
                                })(
                                    <Input.TextArea
                                        placeholder="请输入自我介绍"
                                    />,
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
    };
    //联系方式增加表格
    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(++id);
        form.setFieldsValue({
            keys: nextKeys,
        });
    };
    //联系方式删除表格
    remove = (k) =>{
        const { form } = this.props;
        const { contact } = this.state;
        const keys = form.getFieldValue('keys');
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };
    //名言名句增加表格
    mradd = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('mrkeys');
        const nextKeys = keys.concat(++id);
        form.setFieldsValue({
            mrkeys: nextKeys,
        });
    };
    //名言名句删除表格
    mrremove = (k) =>{
        const { form } = this.props;
        const { contact } = this.state;
        const keys = form.getFieldValue('mrkeys');
        form.setFieldsValue({
            mrkeys: keys.filter(key => key !== k),
        });
    }
}
EditAbout = Form.create()(EditAbout);
export default EditAbout


