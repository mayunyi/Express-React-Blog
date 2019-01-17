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
//显示照片的路径
const fileShowUrl = 'http://localhost:5000/api/upload/img';
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
            allTags:[],
            editArtliceData:{},
            imgList:[]              //封面照显示
        };
        this.editorId = 'editor';
        this.smde = null;
    }

    componentDidMount() {
        this.getAllTags();
        fetch(`/api/articlelist/${this.props.artliceId}` ).then(rep=>{
            return rep.json();
        }).then(json=> {
            if(json.status === 2){
                let artliceData = {
                    articleTitle: json.data.Title,
                    articleWriter: json.data.writer,
                    articleContent: json.data.content,
                    dec:json.data.dec,
                    tags:json.data.tags,
                    img:json.data.img,
                    state:json.data.state,
                    keyword:json.data.keyword,
                    previewImage:'',
                    previewImgVisible: false,
                };
                let imgList = [];
                if(json.data.img){
                    imgList.push({
                        uid: '-1',
                        name: '封面图片.png',
                        status: 'done',
                        url: json.data.img
                    })
                }
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
                    editArtliceData: artliceData,
                    imgList:imgList
                })
            }
        })
    };
    //获取所有的标签
    getAllTags(){
        fetch(
            `/api/tags/find?userId=${getUser().userId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":getUser().token
                },
            }
        ).then(rep=>{
            return rep.json();
        }).then(json=>{
            if(json.status === 2){
                this.setState({
                    allTags:json.data
                })
            }
        })
    }

    /**
     * 保存
     */
    save(){

    }

    /**
     * 封面照 附件相关方法
     *
     * handleImgCancel =>   封面弹出图片关闭
     * beforeUploadFMpic => 附件上传前校验
     * uploadProps => 上传配置参数
     * handlePreview => 预览封面照
     * handleRemoveFMpic => 删除封面照
     * */
    handleImgCancel = () => this.setState({ previewImgVisible: false });
    beforeUploadFMpic = (file) => {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) { //添加文件限制
            message.error('文件大小不能超过10M');
            return false;
        }
        if(file.type.indexOf('image') === -1){
            message.error('只能上传照片附件');
            return false;
        }
    };
    uploadProps = {
        action: fileShowUrl,
        beforeUpload:this.beforeUploadFMpic,
        onChange:(values) => {
            const {file} = values;
            const {editArtliceData} = this.state;
            if (file.status === 'done') {
                editArtliceData.img = fileShowUrl+'/'+file.response.filePath;
                this.setState({
                    editArtliceData
                })
            }
            this.setState({ imgList: [file] });

        },
        listType : "picture-card",
    };
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewImgVisible: true,
        });
    };
    handleRemoveFMpic = (file) =>this.setState({ previewImage: '',imgList:[] });
    /********                  END             *********/
    render() {
        let self = this;
        const { getFieldDecorator } = self.props.form;
        const { previewImgVisible, previewImage, imgList } = this.state;
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 },
        };
        const formItemLayout1 = {
            labelCol: {span: 4},
            wrapperCol: {span: 20}
        };
        const keywordLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 18}
        };
        const uploadButton = (
            <div>
                <Icon type='plus' />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return (
            <Spin tip="发表中..." spinning={this.state.loading}>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col span={24}>
                            <FormItem
                                {...formItemLayout}
                                label="标题"
                            >
                                {getFieldDecorator('Title', {
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
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout1}
                                label="标签"
                            >
                                {getFieldDecorator('tags', {
                                    initialValue: this.state.editArtliceData.tags,
                                    rules: [{
                                        required: true, message: '标签必选!',
                                    }],
                                })(
                                    <Select
                                        mode="multiple"
                                        placeholder='请选择标签'
                                    >
                                        {
                                            this.state.allTags.map(item=>{
                                                return <Option key={item._id} value = {item._id}>{item.tag}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout1}
                                label="作者"
                            >
                                {getFieldDecorator('writer', {
                                    initialValue: this.state.editArtliceData.articleWriter,
                                    rules: [{
                                        required: true, message: '  缺少作者!',
                                    }],
                                })(
                                    <Input placeholder="请输入作者" disabled={true}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem
                                {...keywordLayout}
                                label="关键字"
                            >
                                {getFieldDecorator('keyword', {

                                })(
                                    <Input placeholder="请输入文章关键字,以‘,’号隔开"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} offset={2}>
                            <FormItem
                                {...formItemLayout1}
                                label="封面"
                            >
                                <Upload
                                    {...this.uploadProps}
                                    onPreview = {this.handlePreview}
                                    fileList={imgList}
                                    onRemove  = {this.handleRemoveFMpic}
                                >
                                    {imgList.length>0 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewImgVisible} footer={null} onCancel={this.handleImgCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout1}
                                label="附件"
                            >
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
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem
                                {...formItemLayout}
                                label="文章描述"
                            >
                                {getFieldDecorator('dec', {
                                    initialValue: this.state.editArtliceData.dec,
                                    rules: [{
                                        required: true, message: '请输入文章描述!',
                                    }],
                                })(
                                    <Input placeholder="请输入文章描述"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Input.TextArea  id={this.editorId} placeholder="请输入文章"/>
                            {/*<textarea id={this.editorId}/>*/}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2}>
                            <Row>
                                <FormItem>
                                    <Button type="primary" style = {{float:"left", marginRight:20}}onClick={this.GoBack}>返回</Button>
                                </FormItem>
                            </Row>
                        </Col>
                        <Col span={20} >
                            {
                                this.state.editArtliceData.state == 2 ?
                                <Row>
                                    <FormItem>
                                        <Button type="primary" onClick={this.save.bind(this)} style = {{float:"right"}}>保存</Button>
                                    </FormItem>
                                </Row>
                                    : null
                            }
                        </Col>
                        <Col span={2} >
                            <Row>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" style = {{float:"right" , marginRight:20}}>发表</Button>
                                </FormItem>
                            </Row>
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
        const { allTags } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let value = this.smde.value();
                if(!value){
                    return message.error('请书写文章！')
                }
                this.setState({
                    loading:true
                });
                let tagsArr = [];
                values.tags.map(s=>{
                    allTags.map(item=>{
                        if(s === item._id){
                            tagsArr.push({
                                id:s,
                                name:item.tag
                            })
                        }
                    })
                });
                let postDat = {
                    Title:values.Title,
                    dec:values.dec,
                    content:value,
                    tags:values.tags,
                    img:this.state.imgList.length==0?"":this.state.imgList[0].url,
                    extra_params:{
                        tagsData:tagsArr
                    }
                };

                fetch(`/api/articlelist/edit/${this.props.artliceId}`,{
                    method:"POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":getUser().token
                    },
                    body: JSON.stringify(postDat),
                }).then(rep=>{
                    return rep.json();
                }).then(json=>{
                    if(json.status==2){
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
