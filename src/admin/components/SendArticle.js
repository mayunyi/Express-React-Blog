
/***
 * 发表文章
 */
import React,{Component} from "react";
import {Form,Button,Input,Row, Col,Select,message,Spin,Upload,Icon,Modal} from 'antd';
import SimpleMDE from 'simplemde';
import marked from 'marked';
import highlight from 'highlight.js';
import 'simplemde/dist/simplemde.min.css';
import {getUser} from '../../auth';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
// import '../../../node_modules/react-cropper/node_modules/cropperjs/dist/cropper.css'
const Option = Select.Option;
const FormItem = Form.Item;

const fileShowUrl = 'http://www.mayunyi.top:5000/api/upload/img';

class SendArticle extends Component{
     constructor(props,context){
        super(props,context);
        this.state ={
            value:'',
            user:getUser(),
            allTags:[],
            loading:false,

            srcCropper:'',
            selectImgName:'',
            selectImgSize:0,
            selectImgSuffix:'',
            editImageModalVisible:false,

            imgData:'',
            previewImageFMpic:'',        //封面照片预览
            previewImgVisibleFMpic:false, //封面照片是否预览
            FMZpic:[],
            fmzurl:''       //封面照返回的路径
        };
        this.editorId = 'editor';
        this.smde = null;
     }

    componentDidMount() {
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
        this.getAllTags()
    }

    //获取所有的标签
    getAllTags(){
        fetch(
            `api/tags/find?userId=${getUser().userId}`,
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

    handleSubmit = (e) =>{
        e.preventDefault();
        const { allTags,user } = this.state;
        if(!user.userId){
            message.error('请登录用户！')
        }
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
                    dec:values.dec || '',
                    content:value,
                    tags:values.tags,
                    writerId:this.state.user.userId,
                    writer:values.writer,
                    img:this.state.fmzurl || '',
                    extra_params:{
                        tagsData:tagsArr
                    },
                    keyword:values.keyword.replace(/，/g,',').split(',') || [],          //将中文逗号转英文逗号在分割
                    state:1
                };
                fetch('/api/articlelist/add',{
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
                    if(json.status === 2){
                        this.smde.value('');
                        this.props.form.resetFields();
                        this.setState({
                            loading:false,
                            FMZpic:[],
                            fmzurl:''
                        });
                        return message.success('新增文章成功')
                    } else {
                        this.setState({
                            loading:false
                        });
                        return message.error('提交失败')
                    }
                })
            }
        });
    };

    /**
     * 保存功能
     * */
    save(e){
        e.preventDefault();
        const { allTags,user } = this.state;
        if(!user.userId){
            message.error('请登录用户！')
        }
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
                    dec:values.dec || '',
                    content:value,
                    tags:values.tags,
                    writerId:this.state.user.userId,
                    writer:values.writer,
                    img:this.state.fmzurl || '',
                    extra_params:{
                        tagsData:tagsArr
                    },
                    keyword:values.keyword && values.keyword.replace(/，/g,',').split(',') || [],          //将中文逗号转英文逗号在分割
                    state:2
                };
                fetch('/api/articlelist/add',{
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
                    if(json.status === 2){
                        this.smde.value('');
                        this.props.form.resetFields();
                        this.setState({
                            loading:false,
                            FMZpic:[],
                            fmzurl:''
                        });
                        return message.success('保存文章成功')
                    } else {
                        this.setState({
                            loading:false
                        });
                        return message.error('保存失败')
                    }
                })
            }
        })
    }

    /***封面照上传 start*****/
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
        // 不适用裁剪功能
        // let reader=new FileReader();
        // reader.readAsDataURL(file); //开始读取文件
        // // 因为读取文件需要时间,所以要在回调函数中使用读取的结果
        // reader.onload = (e) => {
        //     this.setState({
        //         srcCropper: e.target.result, //cropper的图片路径
        //         selectImgName: file.name, //文件名称
        //         selectImgSize: (file.size / 1024 / 1024), //文件大小
        //         selectImgSuffix: file.type.split("/")[1], //文件类型
        //         editImageModalVisible: true, //打开控制裁剪弹窗的变量，为true即弹窗
        //     })
        // };
        // return false;
    };
    uploadProps = {
        action: fileShowUrl,
        beforeUpload:this.beforeUploadFMpic,
        onChange:(values) => {
            const {file} = values;
            if (file.status === 'done') {
                this.setState({
                    fmzurl:fileShowUrl+'/'+file.response.filePath
                })
            }
            this.setState({ FMZpic: [file] });

        },
        listType : "picture-card",
    };
    handlePreview = (file) => {
        this.setState({
            previewImageFMpic: file.url || file.thumbUrl,
            previewImgVisibleFMpic: true,
        });
    };
    handleImgCancelFMpic = () => this.setState({ previewImgVisibleFMpic: false });
    handleRemoveFMpic = (file) =>{
        this.setState({
            FMZpic:[],
            fmzurl:''
        })
    };
    /***封面照 end*****/

    render() {
        let self = this;
        const { getFieldDecorator } = self.props.form;
        const { previewImgVisibleFMpic, previewImageFMpic, FMZpic } = this.state;
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
                    <Row >
                        <Col span={24}>
                            <FormItem
                                {...formItemLayout}
                                label="标题"
                            >
                                {getFieldDecorator('Title', {
                                    rules: [{
                                        required: true, message: '标题必填!',
                                    }],
                                })(
                                    <Input placeholder="请输入标题"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout1}
                                label="标签"
                            >
                                {getFieldDecorator('tags', {
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
                        <Col span={12} >
                            <FormItem
                                {...formItemLayout1}
                                label="作者"
                            >
                                {getFieldDecorator('writer', {
                                    initialValue: this.state.user.userName,
                                    rules: [{
                                        required: true, message: '  缺少作者!',
                                    }],
                                })(
                                    <Input placeholder="请输入作者" disabled={true}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <FormItem
                                {...keywordLayout}
                                label="关键字"
                            >
                                {getFieldDecorator('keyword', {
                                    //rules: [{
                                     //   required: true, message: '请输入文章关键字',
                                    //}],
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
                                    fileList={FMZpic}
                                    onRemove  = {this.handleRemoveFMpic}
                                >
                                    {FMZpic.length>0 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewImgVisibleFMpic} footer={null} onCancel={this.handleImgCancelFMpic}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImageFMpic} />
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
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="文章描述"
                            >
                                {getFieldDecorator('dec', {
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
                            {/*<textarea id={this.editorId}/>*/}
                            <Input.TextArea  id={this.editorId} placeholder="请输入文章"/>
                        </Col>
                    </Row>
                    <Row >
                        <Col>
                            <FormItem>
                                <Button type="primary" htmlType="submit" style = {{float:"right"}}>发表</Button>
                                <Button type="primary" onClick={this.save.bind(this)} style = {{float:"right", marginRight:20}}>保存</Button>
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
                        ref='cropper'           //必须指定这个，不然不去不到 getCroppedCanvas（）方法
                    />
                </Modal>
            </Spin>
        );
    }
    _crop(){
        //let imgData = this.refs.cropper.getCroppedCanvas().toDataURL();
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
    handleCancel = () =>{
        this.setState({
            editImageModalVisible:false,
        })
    };
    ImgSave = () => {
        fetch('/api/upload/img',{
            method: 'POST',
            body:this.state.imgData
        }).then(rep=>{
            return rep.json()
        }).then(json=>{
            if(json.status === 2){
                //上传的图片设在在smde中显示
                //下面2种都可以设置
                // self.smde.value("![](/uploads/"+1+")");
                this.smde.codemirror.replaceSelection(`![${this.state.selectImgName}](${fileShowUrl}/${json.filePath})`);
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
    }
}
SendArticle = Form.create()(SendArticle);
export default SendArticle
