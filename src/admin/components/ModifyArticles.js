/*
*   修改文章
 */

import React, { Component } from 'react';
import {Form,Button,Input,Row, Col,Select,message,Spin,Upload,Icon,Modal} from 'antd';
import SimpleMDE from 'simplemde';
import marked from 'marked';
import highlight from 'highlight.js';
import 'simplemde/dist/simplemde.min.css';
import {getUser} from '../../auth';
import Cropper from 'react-cropper';
import '../../../node_modules/react-cropper/node_modules/cropperjs/dist/cropper.css'
const Option = Select.Option;
const FormItem = Form.Item;

class ModifyArticles extends Component{

    constructor(props,context){
        super(props,context);
        this.state ={
            user:getUser(),
            loading:false,

            srcCropper:'',
            selectImgName:'',
            selectImgSize:0,
            selectImgSuffix:'',
            editImageModalVisible:false,
            imgData:'',

            editArtliceData:{}
        };
        this.editorId = 'editor';
        this.smde = null;
    }

    componentDidMount() {
        fetch(`/blog/article/${this.props.artliceId}` ).then(rep=>{
            return rep.json();
        }).then(json=> {
            let artliceData = {
                articleTitle: json.res.articleTitle,
                articleWriter: json.res.articleWriter,
                articleContent: json.res.articleContent
            };
            //加载markdown的插件
            this.smde = new SimpleMDE({
                element: document.getElementById(this.editorId).childElementCount,
                autofocus: true,
                autosave: true,
                previewRender: function (plainText) {
                    return marked(plainText, {
                        renderer: new marked.Renderer(),
                        gfm: true,
                        pedantic: false,
                        sanitize: false,
                        tables: true,
                        breaks: true,
                        smartLists: true,
                        smartypants: true,
                        highlight: function (code) {
                            return highlight.highlightAuto(code).value;
                        }
                    });
                },
            });
            this.smde.value(artliceData.articleContent);
            this.setState({
                editArtliceData: artliceData
            })
        })
    };

    render() {
        let self = this;
        const { getFieldDecorator } = self.props.form;

        const formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 22}
        };
        const formItemLayout1 = {
            labelCol: {span: 4},
            wrapperCol: {span: 20}
        };
        return (
            <Spin tip="发表中..." spinning={this.state.loading}>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col span={16}>
                            <FormItem
                                {...formItemLayout}
                                label="标题"
                            >
                                {getFieldDecorator('titleValue', {
                                    initialValue:this.state.editArtliceData.articleTitle,
                                    rules: [{
                                        required: true, message: '标题必填!',
                                    }],
                                })(
                                    <Input placeholder="请输入标题"/>
                                )}
                            </FormItem>

                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout1}
                                label="作者"
                            >
                                {getFieldDecorator('articleWriter', {
                                    initialValue: this.state.editArtliceData.articleWriter,
                                    rules: [{
                                        required: true, message: '  缺少作者!',
                                    }],
                                })(
                                    <Input placeholder="请输入作者" disabled={true}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout1}
                                label="附件"
                            >
                                {getFieldDecorator('imgList')(
                                    <Upload
                                        listType="picture-card"
                                        showUploadList={false}
                                        beforeUpload={this.beforeUpload}
                                    >
                                        <div>
                                            <Icon type="plus" />
                                            <div className="ant-upload-text">上传图片</div>
                                        </div>
                                    </Upload>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <textarea id={this.editorId}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <FormItem>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                >
                                    发表
                                </Button>
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <FormItem>
                                <Button
                                    type="primary"
                                    onClick={this.GoBack}
                                >
                                    返回
                                </Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Modal
                    visible={this.state.editImageModalVisible}
                    width = {800}
                    closable = {false}
                    footer={[
                        <Button key="ok" type="primary" onClick={this.ImgSave}>确认</Button>,
                        <Button key="handle" onClick={this.handleCancel}>取消</Button>
                    ]}
                >
                    <Cropper
                        src={this.state.srcCropper} //图片路径，即是base64的值，在Upload上传的时候获取到的
                        style={{ height: 400 }}
                        viewMode={1} //定义cropper的视图模式
                        zoomable={true} //是否允许放大图像
                        //aspectRatio={16/9} //image的纵横比
                        guides={true} //显示在裁剪框上方的虚线
                        background={false} //是否显示背景的马赛克
                        rotatable={false} //是否旋转
                        crop={this._crop.bind(this)}
                        ref='cropper'           //必须指定这个，不然不去不到getCroppedCanvas（）方法
                    />
                </Modal>
            </Spin>
        )
    }
    GoBack = () =>{
        this.props.CallBack();
    };
    _crop(){
        let imgData = this.refs.cropper.getCroppedCanvas().toDataURL();

        const croppedCanvas = this.refs.cropper.getCroppedCanvas({
            minWidth: 200,
            minHeight: 200,
            width: 200,
            height: 200,
            maxWidth: 200,
            maxHeight: 200
        });

        croppedCanvas.toBlob(async blob => {
            // 图片name添加到blob对象里
            blob.name = this.state.selectImgName;
            // 创建提交表单数据对象
            const filedata = new FormData();
            // 添加要上传的文件
            filedata.append('file', blob, blob.name);
            this.setState({
                imgData:filedata
            });
        }, "image/png");
    }
    handleCancel = () =>{
        this.setState({
            editImageModalVisible:false,
        })
    };
    ImgSave = () => {
        fetch('/blog/upload/img',{
            method: 'POST',
            body:this.state.imgData
        }).then(rep=>{
            return rep.json()
        }).then(json=>{
            if(json.res.msg){
                //上传的图片设在在smde中显示
                //下面2种都可以设置
                // self.smde.value("![](/uploads/"+1+")");
                this.smde.codemirror.replaceSelection(`![${this.state.selectImgName}](http://db.mayunyi.top/blog/static${json.res.src[0]})`);
                this.setState({
                    editImageModalVisible:false,
                })
            }

        })
    };
    beforeUpload = (file) => {
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
        reader.readAsDataURL(file); //开始读取文件
        // 因为读取文件需要时间,所以要在回调函数中使用读取的结果
        reader.onload = (e) => {
            this.setState({
                srcCropper: e.target.result, //cropper的图片路径
                selectImgName: file.name, //文件名称
                selectImgSize: (file.size / 1024 / 1024), //文件大小
                selectImgSuffix: file.type.split("/")[1], //文件类型
                editImageModalVisible: true, //打开控制裁剪弹窗的变量，为true即弹窗
            })
        };
        return false;
    };
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let value = this.smde.value();
                if(!value){
                    return message.error('请书写文章！')
                }
                this.setState({
                    loading:true
                });
                let postDat = {
                    articleTitle:values.titleValue,
                    articleWriter:values.articleWriter,
                    articleContent:value,
                };
                fetch(`/blog/iarticle/${this.props.artliceId}`,{
                    method:"PUT",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(postDat),
                }).then(rep=>{
                    return rep.json();
                }).then(json=>{
                    if(JSON.stringify(json.res) != '{}'){
                        this.smde.value('');
                        this.props.form.resetFields();
                        this.setState({
                            loading:false
                        });
                        this.props.CallBack();
                        return message.success('编辑成功!')
                    } else {
                        this.setState({
                            loading:false
                        });
                        return message.error('编辑失败')
                    }
                })
            }
        })
    }
}

ModifyArticles = Form.create()(ModifyArticles);
export default ModifyArticles
