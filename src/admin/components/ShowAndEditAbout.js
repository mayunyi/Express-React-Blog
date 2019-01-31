/**
 * Created by mahai on 2019/1/21.
 * 显示关于的详情以及编辑
 */

import React, { Component } from 'react';
import {Upload,Icon,message,Form, Row, Col,Input,Button,Modal,Spin} from 'antd';
import {getUser} from '../../auth';
import Cropper from 'react-cropper';
const FormItem = Form.Item;
const Fragment = React.Fragment;
const fileShowUrl = 'http://www.mayunyi.top:5000/api/upload/img';
let id = 0;
let mrId = 0;

class ShowAndEditAbout extends Component{
    constructor(props){
        super(props);
        this.state = {
            isEdit:false,  //  判断是是编辑
            contact:[],         //编辑状态渲染联系数据
            WellknownSaying:[],  //编辑状态渲染数据

            previewImage:'',
            previewImgVisible:false,
            avatarList:[],
            avatar : "",

            //裁剪相关设置
            srcCropper:'',
            selectImgName:'',
            selectImgSize:0,
            selectImgSuffix:'',
            CropperVisible:false,

            spinLoading:false
        };
        this.user = getUser();
    }

    componentDidMount(){
        const { form } = this.props;
        const { data } = this.props;
        const contact = data.contact;
        const WellknownSaying = data.WellknownSaying;
        let stateContact = [];
        let stateWellknownSaying = [];

        for(let i =0; i< contact.length;i++){
            let keyN = `contact_name_${i+1}`;
            let keyV = `contact_number_${i+1}`;
            stateContact.push({
                [keyN]:contact[i].contact_name,
                [keyV]:contact[i].contact_number
            });
            const keys = form.getFieldValue('keys');
            const nextKeys = keys.concat(++id);
            form.setFieldsValue({
                keys: nextKeys,
            });
        }
        for(let k =0; k< WellknownSaying.length;k++){
            let keyN = `WellknownSaying_${k+1}`;
            stateWellknownSaying.push({
               [keyN]:WellknownSaying[k]
            });
            const mrkeys = form.getFieldValue('mrkeys');
            const mrnextKeys = mrkeys.concat(++mrId);
            form.setFieldsValue({
                mrkeys: mrnextKeys,
            });
        }
        let avatarList =[];
        if(data.img){
            avatarList.push({
                uid: '-1',
                name: '头像.png',
                status: 'done',
                url: data.img
            })
        }
        this.setState({
            contact:stateContact,
            WellknownSaying:stateWellknownSaying,
            avatar:data.img,
            avatarList
        })
    }
    componentWillUnmount(){
        //组件卸载调用
        id =0;
        mrId =0;
        this.props.form.resetFields();
        this.setState = (state,callback)=>{
            return;
        };
    }



    //联系方式增加表格
    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(++id);
        const { contact } = this.state;
        let keyN = `contact_name_${id}`;
        let keyV = `contact_number_${id}`;
        contact.push({
            [keyN]:'',
            [keyV]:''
        });
        form.setFieldsValue({
            keys: nextKeys,
        });
        this.setState({
            contact
        })

    };
    //联系方式删除表格
    remove = (k) =>{
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const { contact } = this.state;
        let newContact = [];
        contact.filter(key => {
            //获取对象key的第一个key
            let keyArr = Object.keys(key)[0].split('_')[2];        //取最后的数值
            if(k !== Number(keyArr)){
                newContact.push(key)
            }
        });
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
        this.setState({
            contact:newContact
        })
    };
    //名言名句增加表格
    mradd = () => {
        const { form } = this.props;
        const { WellknownSaying } = this.state;
        const keys = form.getFieldValue('mrkeys');
        const nextKeys = keys.concat(++mrId);
        let keyN = `WellknownSaying_${mrId}`;
        WellknownSaying.push({
            [keyN]:''
        });
        form.setFieldsValue({
            mrkeys: nextKeys,
        });
        this.setState({
            WellknownSaying
        })
    };
    //名言名句删除表格
    mrremove = (k) =>{
        const { form } = this.props;
        const { WellknownSaying } = this.state;
        const keys = form.getFieldValue('mrkeys');
        let newWellknownSaying = [];
        WellknownSaying.filter(key => {
            //获取对象key的第一个key
            let keyArr = Object.keys(key)[0].split('_')[1];        //取最后的数值
            if(k !== Number(keyArr)){
                newWellknownSaying.push(key)
            }
        });
        form.setFieldsValue({
            mrkeys: keys.filter(key => key !== k),
        });
        this.setState({
            WellknownSaying:newWellknownSaying
        })
    };


    onSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.setState({
                    spinLoading:true,
                });
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
                let PutData = {
                    contact:contactArr,
                    dec:values.dec,
                    img:avatar,
                    WellknownSaying:mrArr
                };
                let aboutId = this.props.data._id;
                fetch(`/api/about/edit/${aboutId}`,{
                    method:"POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":this.user.token
                    },
                    body:  JSON.stringify(PutData)
                }).then(rep=>{
                    return rep.json()
                }).then(json=>{
                    if(json.status === 2){
                        this.props.getUserAbout();      //重新获取用户关于的数据
                        let self = this;
                        setTimeout(()=>{
                            self.setState({
                                spinLoading:false,
                                isEdit:false
                            });
                            message.success('编辑成功');
                        },1000)
                    } else {
                        this.setState({
                            spinLoading:false,
                        });
                        message.error(json.msg)
                    }
                })
            }
        })
    };

    unitValue(value,index){
        const { contact } = this.state;
        contact.filter(key => {
            //获取对象key的第一个key
            let keyArr = Object.keys(key)[0].split('_')[2];        //取最后的数值
            if(index == Number(keyArr)){
                key[`contact_name_${index}`] = value
            }
        });
        this.setState({
            contact
        })
    }
    unitNumber(value,index){
        const { contact } = this.state;
        contact.filter(key => {
            //获取对象key的第一个key
            let keyArr = Object.keys(key)[0].split('_')[2];        //取最后的数值
            if(index == Number(keyArr)){
                key[`contact_number_${index}`] = value
            }
        });
        this.setState({
            contact
        })
    }

    WellknownSayingValue(value,index){
        const { WellknownSaying } = this.state;
        WellknownSaying.filter(key => {
            //获取对象key的第一个key
            let keyArr = Object.keys(key)[0].split('_')[1];        //取最后的数值
            if(index == Number(keyArr)){
                key[`WellknownSaying_${index}`] = value
            }
        });
        this.setState({
            WellknownSaying
        })
    }


    //头像修改
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewImgVisible: true,
        });
    };
    handleRemovepic = (file) =>this.setState({ previewImage: '',avatarList:[],avatar:'' });

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
    // end

    //图片裁剪
    _crop(){
        const croppedCanvas = this.refs.cropper.getCroppedCanvas({
            minWidth: 200,
            minHeight: 200,
        });

        croppedCanvas.toBlob(async blob => {
            if(blob){
                // 图片name添加到blob对象里
                let timestamp = Date.parse(new Date());
                blob.name = timestamp + '.jpeg';
                //blob.name = this.state.selectImgName;
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

    render(){
        const { isEdit ,contact, WellknownSaying,avatar,avatarList,previewImgVisible,previewImage} = this.state;
        const { data } = this.props;
        const { getFieldDecorator,getFieldValue } = this.props.form;
        const Layout = {
            labelCol: {span: 6},
            wrapperCol: {span: 18}
        };
        const Layout1 = {
            labelCol: {span: 12},
            wrapperCol: {span: 18,offset:6}
        };
        const Layout2 = {
            labelCol: {span: 0},
            wrapperCol: {span: 20,offset:2}
        };
        const mrLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 20}
        };
        const mrLayout1 = {
            labelCol: {span: 3},
            wrapperCol: {span: 20,offset:3}
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
        const formItems =  keys.map((item,index) =>{
            return (
                <Row key ={index}>
                    <Col span={8}>
                        <FormItem
                            {...(index === 0 ? Layout : Layout1)}
                            label={index === 0 ? '联系方式' : ''}
                        >
                            {getFieldDecorator(`contact_name_${item}`, {
                                initialValue: !isEdit ? data.contact[index].contact_name : contact[index][`contact_name_${item}`],
                                rules: [{
                                    required: isEdit,
                                    message: '请输入联系方式!',
                                }],
                            })(
                                <Input
                                    placeholder="请输入联系方式"
                                    disabled={!isEdit}
                                    onChange = {(e)=>this.unitValue(e.target.value,item)}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} >
                        <FormItem
                            {...Layout2}
                        >
                            {getFieldDecorator(`contact_number_${item}`, {
                                initialValue:!isEdit ? data.contact[index].contact_number :contact[index][`contact_number_${item}`],
                                rules: [{
                                    required: isEdit,
                                    message: '请输入联系号码!',
                                }],
                            })(
                                <Input
                                    placeholder="请输入联系号码"
                                    disabled={!isEdit}
                                    onChange = {(e)=>this.unitNumber(e.target.value,item)}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    {
                        isEdit && index < 2 &&
                        <Col span={1}>
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
                        isEdit && index+1 == keys.length && index>0 &&
                        <Col span={1}>
                            <FormItem>
                                <Button shape="circle" size="small" icon="minus" type="primary"
                                        onClick={() => this.remove(item)}/>
                            </FormItem>
                        </Col>
                    }
                </Row>
            )
        });
        //名言
        const ShowWellknownSayingItems = mrkeys.map((item,index)=> {
            return (
                <Row key ={index}>
                    <Col span={16}>
                        <FormItem
                            {...(index === 0 ? mrLayout : mrLayout1)}
                            label={index === 0 ? '名言名句' : ''}
                        >
                            {getFieldDecorator(`WellknownSaying_${item}`, {
                                //initialValue:WellknownSaying[index],
                                initialValue:!isEdit ? data.WellknownSaying[index] : WellknownSaying[index][`WellknownSaying_${item}`],
                                rules: [{
                                    required: isEdit,
                                    message: '请输入名言名句!',
                                }],

                            })(
                                <Input.TextArea
                                    placeholder="请输入名言名句"
                                    disabled={!isEdit}
                                    onChange = {(e)=>this.WellknownSayingValue(e.target.value,item)}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    {
                        isEdit && index < 2 &&
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
                                        />
                                    </FormItem>
                            }
                        </Col>
                    }
                    {
                        isEdit && index+1 == mrkeys.length && index>0 &&
                        <Col span={1}>
                            <FormItem>
                                <Button
                                    shape="circle"
                                    size="small"
                                    icon="minus"
                                    type="primary"
                                    onClick={() => this.mrremove(item)}
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
                        {ShowWellknownSayingItems}
                        <Row>
                            <Col>
                                <FormItem
                                    {... decLayout}
                                    label='自我介绍'
                                >
                                    {getFieldDecorator(`dec`, {
                                        initialValue:data.dec,
                                    })(
                                        <Input.TextArea
                                            placeholder="请输入自我介绍"
                                            autosize = {
                                                {minRows:4, maxRows:8}
                                            }
                                            disabled={!isEdit}
                                        />,
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



    /**
     * 联系方式  在点击取消恢复接口数据
     * @param type      增加          比如：详情是3列，点击编辑后我去除一列，我不保存，我直接取消，那么在进入详情的时候还是3列，而不是2列
     * @param data      原始数据
     * @constructor
     */
    FormDataChange = (type,data,value) =>{
        const { form } = this.props;

        id =0;
        data.contact.map((item,index)=>{
            const keys = form.getFieldValue('keys');
            const nextKeys = keys.concat(++index);
            id = index;
            form.setFieldsValue({
                keys: nextKeys,
            });
        });

        let newData = [];
        if(type == 'add'){
            let fromKey = form.getFieldValue('keys');
            fromKey.map((item,index)=>{
                let keyN = `contact_name_${item}`;
                let keyV = `contact_number_${item}`;
                newData.push({
                    [keyN]:data.contact[index].contact_name,
                    [keyV]:data.contact[index].contact_number
                });
            })
        } else {
            for(let i=0;i< value; i++){
                const removeKey = form.getFieldValue('keys');
                form.setFieldsValue({
                    keys: removeKey.filter(key => key !== removeKey[removeKey.length-1]),
                });
            }
            let fromKey = form.getFieldValue('keys');
            fromKey.map((item,index)=>{
                let keyN = `contact_name_${item}`;
                let keyV = `contact_number_${item}`;
                newData.push({
                    [keyN]:data.contact[index].contact_name,
                    [keyV]:data.contact[index].contact_number
                });
            });
        }
        this.setState({
            contact:newData
        })
    };

    /**
     *  名人名言  在点击取消恢复接口数据
     * @param type      增加          比如：详情是3列，点击编辑后我去除一列，我不保存，我直接取消，那么在进入详情的时候还是3列，而不是2列
     * @param data      原始数据
     * @constructor
     */
    MRFormDataChange = (type,data,value) =>{
        const { form } = this.props;
        mrId =0;
        data.WellknownSaying.map((item,index)=>{
            const mrkeys = form.getFieldValue('mrkeys');
            const nextKeys = mrkeys.concat(++index);
            mrId = index;
            form.setFieldsValue({
                mrkeys: nextKeys,
            });
        });

        let newData = [];
        if(type == 'add'){
            // for(let i=0;i< value; i++){
            //     const keys = form.getFieldValue('mrkeys');
            //     const nextKeys = keys.concat(++id);
            //     form.setFieldsValue({
            //         mrkeys: nextKeys,
            //     });
            // }
            let MrfromKey = form.getFieldValue('mrkeys');
            MrfromKey.map((item,index)=>{
                let keyN = `WellknownSaying_${item}`;
                newData.push({
                    [keyN]:data.WellknownSaying[index]
                });
            })
        } else {
            for(let i=0;i< value; i++){
                const removeKey = form.getFieldValue('mrkeys');
                form.setFieldsValue({
                    mrkeys: removeKey.filter(key => key !== removeKey[removeKey.length-1]),
                });
            }
            let MrfromKey = form.getFieldValue('mrkeys');
            MrfromKey.map((item,index)=>{
                let keyN = `WellknownSaying_${item}`;
                newData.push({
                    [keyN]:data.WellknownSaying[index],
                });
            });
        }
        this.setState({
            WellknownSaying:newData
        })
    };

    EditHandel = () =>{
        const { form,data } = this.props;
        form.resetFields();
        const contact = data.contact;
        const WellknownSaying = data.WellknownSaying;

        const keys = form.getFieldValue('keys');
        const mrkeys = form.getFieldValue('mrkeys');

        if (contact.length > keys.length){
            let value = contact.length - keys.length;
            this.FormDataChange('add',data,value)
        } else {
            let value = keys.length - contact.length;
            this.FormDataChange('remove',data,value);
        }
        if (WellknownSaying.length > mrkeys.length){
            let value = WellknownSaying.length - mrkeys.length;
            this.MRFormDataChange('add',data,value);
        } else {
            let value = mrkeys.length - WellknownSaying.length;
            this.MRFormDataChange('remove',data,value);
        }
        this.setState({
            avatar:data.img,
            isEdit:false
        })
    };
    Edit = () =>{
        this.setState({
            isEdit:true
        })
    }
}

ShowAndEditAbout = Form.create()(ShowAndEditAbout);
export default ShowAndEditAbout