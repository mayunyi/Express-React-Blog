
import React, { Component } from 'react';
import {Table,Pagination,Divider,message,Form, Row, Col,Select,Input,Button} from 'antd'
import {getUser} from '../../auth';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const Fragment = React.Fragment;

let id = 0;
class EditAbout extends Component{
    constructor(props){
        super(props);
        this.state = {
            contact:[]
        }
    }
    componentDidMount(){
        this.add()
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
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
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

        })

        return (
            <Fragment>
                <Form onSubmit={this.onSubmit} >
                    {
                        formItems
                    }
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
    }
    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(++id);
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    remove = (k) =>{
        const { form } = this.props;
        const { contact } = this.state;
        const keys = form.getFieldValue('keys');
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }
}
EditAbout = Form.create()(EditAbout);
export default EditAbout


