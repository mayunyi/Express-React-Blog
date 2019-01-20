
import React, { Component } from 'react';
import {Table,Pagination,Divider,message,Form, Row, Col,Select,Input,Button} from 'antd'
import {getUser} from '../../auth';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const Fragment = React.Fragment;

let id = 0;
let mrId = 0;
class EditAbout extends Component{
    constructor(props){
        super(props);
        this.state = {
            contact:[]
        }
    }
    componentDidMount(){
        this.add()
        this.mradd()
    }

    onSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        })
    };
    render () {
        let self = this;
        const { getFieldDecorator,getFieldValue  } = self.props.form;
        const { contact } = self.state;
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
                    {formItems}
                    {mrItems}
                    <Row >
                        <Col>
                            <FormItem>
                                <Button type="primary" htmlType="submit" style = {{float:"right"}}>发表</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
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


