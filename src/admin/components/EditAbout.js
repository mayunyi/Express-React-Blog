
import React, { Component } from 'react';
import {Table,Pagination,Divider,message,Form, Row, Col,Select,Input,Button} from 'antd'
import {getUser} from '../../auth';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const Fragment = React.Fragment;

class EditAbout extends Component{
    constructor(props){
        super(props);
        this.state = {
            contact:[
                {
                    contact_name:'qq',
                    contact_number:'qq'
                }
            ]
        }
    }

    onSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            debugger
        })
    };
    render () {
        let self = this;
        const { getFieldDecorator } = self.props.form;
        const { contact } = self.state;
        const Layout = {
            labelCol: {span: 12},
            wrapperCol: {span: 12}
        };
        const Layout1 = {
            labelCol: {span: 12},
            wrapperCol: {span: 12,offset:12}
        };
        return (
            <Fragment>
                <Form onSubmit={this.onSubmit} >
                    {
                        contact.map((item,index)=> {

                            return (
                                <Row key ={index}>
                                    <Col span={4}>
                                        {
                                            index === 0 ?
                                                <FormItem
                                                    {...Layout}
                                                    label='联系方式'
                                                >
                                                    {getFieldDecorator(`contact_name`, {
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入联系方式!',
                                                        }],
                                                    })(
                                                        <Input placeholder="请输入联系方式"/>,
                                                    )}
                                                </FormItem>
                                                :
                                                <FormItem
                                                    {...Layout1}
                                                >
                                                    {getFieldDecorator(`contact_name`, {
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入联系方式!',
                                                        }],
                                                    })(
                                                        <Input placeholder="请输入联系方式"/>,
                                                    )}
                                                </FormItem>
                                        }

                                    </Col>
                                    <Col span={4} offset={1}>
                                        <Row>
                                            <Col span={16}>
                                                <FormItem>
                                                    {getFieldDecorator(`contact_name`, {
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入联系方式!',
                                                        }],
                                                    })(
                                                        <Input placeholder="请输入联系方式"/>,
                                                    )}
                                                </FormItem>
                                            </Col>
                                            {
                                                index < 3 &&
                                                <Col span={2} offset={1}>
                                                    {
                                                        contact.length ==1?
                                                            <FormItem>
                                                                <Button shape="circle" size="small" icon="plus" type="primary"
                                                                        onClick={() => this.onLinkWay(index, 'add')}/>
                                                            </FormItem>
                                                            :
                                                            <FormItem>
                                                                <Button shape="circle" size="small" icon="minus" type="primary"
                                                                        onClick={() => this.onLinkWay(index, 'minus')}/>
                                                            </FormItem>
                                                    }

                                                </Col>
                                            }
                                            {
                                                index > 0 &&
                                                <Col span={2} offset={1}>
                                                    <FormItem>
                                                        <Button shape="circle" size="small" icon="minus" type="primary"
                                                                onClick={() => this.onLinkWay(index, 'minus')}/>
                                                    </FormItem>
                                                </Col>
                                            }
                                        </Row>
                                    </Col>
                                </Row>
                            )
                        })
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
    onLinkWay = (index,type) =>{
        const { contact } = this.state
        if(type === 'add'){
            contact.push({
                contact_name:'qq',
                contact_number:'qq'
            })
        }
        this.setState({
            contact
        })
    }
}
EditAbout = Form.create()(EditAbout);
export default EditAbout


