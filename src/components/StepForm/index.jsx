import React, { Component } from 'react';
import { goToUrl } from '../../utils'
import { Route, HashRouter, Switch } from 'react-router-dom'
import { Form, Card, Input, Icon, Button, message, } from 'antd';
export default class StepForm extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <Route path="/admin/ads"
                        render={() =>
                            <div>
                                <Switch>
                                    <Route
                                        exact={true}
                                        path="/admin/ads/info"
                                        render={() =>
                                            <Info
                                                selectedItem={this.props.selectedItem}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/admin/ads/confirm"
                                        render={() =>
                                            <Confirm
                                                refreshData={this.props.refreshData}
                                            />}
                                    />
                                </Switch>
                            </div>
                        }
                    />
                </div>
            </HashRouter >
        );
    }
}

const FormItem = Form.Item;
class FormInfo extends React.Component {
    handleSubmit = () => {//绑定提交事件进行校验
        let userInfo = this.props.form.getFieldsValue();//object对象,包含表单中所有信息
        // 校验表单输入是否符合规则， 不符合err会包含信息, 校验通过err为空
        this.props.form.validateFields((err, values) => {
            if (!err) {// ${}  是变量
                message.success("正在下单")
                // 前端验证完毕, 向后端发起调用
                goToUrl('/admin/ads/confirm')
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: 24,
                sm: 4
            },
            wrapperCol: {
                xs: 24,
                sm: 12
            }
        };
        return (
            <div>
                <Card title="下单"
                >
                    <Form
                        layout="horizontal"
                    >
                        <FormItem>
                            <p>{JSON.stringify(this.props.selectedItem)}</p>
                        </FormItem>
                        <FormItem
                            label="交易量"
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator('userName', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '金额不能为空'
                                        },
                                        {
                                            min: 1, max: 8,
                                            message: '长度不在范围内'
                                        },
                                        {
                                            pattern: new RegExp('^\\d+$', 'g'),
                                            message: '必须为数字'
                                        },
                                    ]
                                })(
                                    <Input prefix={<Icon type="money-collect" />} placeholder="请输入交易金额" />
                                )
                            }
                        </FormItem>
                        <FormItem
                            style={{
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: 200,
                            }}
                        >
                            <Button
                                type="primary"
                                onClick={
                                    () => {
                                        this.handleSubmit()
                                    }
                                }
                            >
                                确认订单
            </Button>
                        </FormItem>
                    </Form>
                </Card>
            </div >
        )
    }
}
const Info = Form.create()(FormInfo)

class FormConfirm extends React.Component {
    handleSubmit = () => {
        message.success(`请等待商户确认`)
        goToUrl('/admin/ads/index')
        this.props.refreshData()
    }
    render() {
        return (
            <Card title="付款码">
                <Form>
                    <FormItem
                    >
                        <img alt="Cierra.jpg" src="https://img.moegirl.org/common/thumb/a/aa/Cierra01.jpg/260px-Cierra01.jpg" />
                    </FormItem>
                    <FormItem
                        style={{
                            margin: 'auto',
                            width: 200,
                        }}
                    >
                        <Button
                            type="primary"
                            onClick={
                                () => {
                                    this.handleSubmit()
                                }
                            }
                        >
                            我已付款
        </Button>
                    </FormItem>
                </Form>
            </Card>
        )
    }
}

const Confirm = Form.create()(FormConfirm)