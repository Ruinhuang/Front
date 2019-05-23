import React, { Component } from 'react';
import { connect } from "react-redux"
import Ajax from '../Ajax'
import { goToUrl } from '../../utils'
import { Route, HashRouter, Switch } from 'react-router-dom'
import { Modal, Form, Card, Input, Icon, Button, message, } from 'antd';
import { Radio } from 'antd';

class StepForm extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <Route path="/ads"
                        render={() =>
                            <div>
                                <Switch>
                                    <Route
                                        exact={true}
                                        path="/ads/info"
                                        render={() =>
                                            <Info
                                                selectedItem={this.props.selectedItem}
                                                infoSubmitFunc={this.props.infoSubmitFunc}
                                            />
                                        }
                                    />
                                    <Route
                                        exact={true}
                                        path="/ads/confirm"
                                        render={() =>
                                            <Confirm
                                                refreshData={this.props.refreshData}
                                                confirmSubmitFunc={this.props.confirmSubmitFunc}
                                                currentUserId={this.props.user.userId}
                                                selectedItem={this.props.selectedItem}
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
        let formInfo = this.props.form.getFieldsValue();//object对象,包含表单中所有信息
        // 校验表单输入是否符合规则， 不符合err会包含信息, 校验通过err为空
        this.props.form.validateFields((err, values) => {
            if (!err) {
                formInfo.count = parseInt(formInfo.count)
                // formInfo.count = parseFloat(formInfo.count)
                formInfo.amount = formInfo.count * this.props.selectedItem.price
                this.props.infoSubmitFunc(formInfo)
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
                <Card title={this.props.selectedItem.type}
                >
                    <Form
                        layout="horizontal"
                    >
                        <FormItem label="广告ID" {...formItemLayout} >
                            {
                                getFieldDecorator('adId', {
                                    initialValue: this.props.selectedItem.id,
                                    rules: [
                                        {
                                            required: true,
                                            message: '不能为空'
                                        },
                                    ]
                                })(<Input disabled={true} />)
                            }
                        </FormItem>
                        <FormItem label="商户ID" {...formItemLayout} >
                            {
                                getFieldDecorator('uid', {
                                    initialValue: this.props.selectedItem.merchantUid,
                                    rules: [
                                        {
                                            required: true,
                                            message: '不能为空'
                                        },
                                    ]
                                })(<Input disabled={true} />)
                            }
                        </FormItem>
                        <FormItem label="价格" {...formItemLayout} >
                            {
                                getFieldDecorator('price', {
                                    initialValue: this.props.selectedItem.price,
                                    rules: [
                                        {
                                            required: true,
                                            message: '不能为空'
                                        },
                                    ]
                                })(<Input disabled={true} />)
                            }
                        </FormItem>
                        <FormItem
                            label="交易量"
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator('count', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '不能为空'
                                        },
                                        {
                                            pattern: new RegExp('^\\d+$', 'g'),
                                            message: '必须为数字'
                                        },
                                    ]
                                })(
                                    <Input prefix={<Icon type="money-collect" />} placeholder="请输入交易数量" />
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
    constructor(props) {
        super(props)
        this.state = {
            payeeTypes: []
        }
        this.payTypes = this.props.selectedItem.paytypeList.map(
            (item) => ({ label: item.typeName, value: item.id })
        )
    }

    handleSubmit = () => {
        let formConfirm = this.props.form.getFieldsValue();//object对象,包含表单中所有信息
        // 校验表单输入是否符合规则， 不符合err会包含信息, 校验通过err为空
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.confirmSubmitFunc(formConfirm)
                this.props.refreshData()
            }
        }
        )
    }
    componentDidMount = () => {
        // 獲得當前登登錄用戶的收付款方式
        Ajax.ajax(
            'get',
            '/user/paytype/list',
            { "X-BM-USER-ID": this.props.currentUserId },
            {},
            "http://45.76.146.27",
        ).then(
            (data) => {
                const list = data.data.map(
                    (item) => ({ label: item.typeName, value: item.id })
                )
                this.setState(() => {
                    return {
                        payeeTypes: list,
                    }
                })
            })

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const RadioGroup = Radio.Group;
        const formItemLayout = {
            labelCol: {
                xs: 24,
                sm: 4
            },
            wrapperCol: {
                xs: 24,
                sm: 12
            }
        }
        return (
            <Card title="" >
                <Form>
                    <FormItem label="商戶收款方式" >
                        {
                            getFieldDecorator("payTypeId", {
                                rules: [
                                    {
                                        required: true,
                                        message: '选择商户的收款账户'
                                    },
                                ]
                            })(
                                <RadioGroup options={this.payTypes} />
                            )
                        }
                    </FormItem>
                    <FormItem label="用戶支付渠道" >
                        {
                            getFieldDecorator("payeeTypeId", {
                                rules: [
                                    {
                                        required: true,
                                        message: '選擇支付方式'
                                    },
                                ]
                            })(
                                <RadioGroup options={this.state.payeeTypes} />
                            )
                        }
                    </FormItem>
                    <FormItem>
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
// props 属性
const mapStateToProps = (state) => ({
    isLogin: state.isLogin,
    user: state.user
})

// 把逻辑方法与UI组件连接起来变成新容器组件
export default connect(mapStateToProps)(StepForm)