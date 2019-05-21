import React from "react";
import { connect } from "react-redux"
import { actionCreator } from "../../redux/action"
import { Button, Card, Form, Icon, Select, Input, Checkbox, message, Radio } from "antd";
import { goToUrl } from "../../utils"; //导入公共机制
import Ajax from '../../components/Ajax'
const Option = Select.Option
const RadioGroup = Radio.Group
const FormItem = Form.Item
class FormMyInfo extends React.Component {
    post = (formData) => {
        Ajax.ajax(
            'post',
            '/user-login',
            { "X-BM-USER-ID": this.props.user.token },
            formData,
            "https://mook.sunlin.fun/mock/9/"
        )
            .then(
                (res) => {
                }
            ).catch(() => { })
    }

    handleSubmit = () => {//绑定提交事件进行校验
        let formData = this.props.form.getFieldsValue()// 可以(获取表单中)object对象
        this.props.form.validateFields((err, values) => {
            if (!err) {// ${}  是变量
                this.post(formData)
            }
        });
    };
    passwordValidator = (rule, value, callback) => {
        let password = this.props.form.getFieldsValue().password
        console.log(rule, value, password)
        if (value && value !== password) {
            callback('密码输入不一致！')
        }
        callback()
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const offsetLayout = {
            wrapperCol: {
                xs: 24,
                sm: {
                    span: 12,
                    offset: 4
                }
            }
        };
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
                <Card title="我的信息"
                >
                    <Form
                        layout="horizontal"
                    >
                        <FormItem label="用户名" {...formItemLayout}>
                            {
                                getFieldDecorator('userName', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '用户名不能为空'
                                        },
                                        {
                                            min: 1, max: 16,
                                            message: '长度不在范围内'
                                        },
                                        {
                                            pattern: new RegExp('^\\w+$', 'g'),
                                            message: '用户名必须为字母或数字'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入用户名" />
                                )
                            }
                        </FormItem>
                        <FormItem label="密码" {...formItemLayout}>
                            {
                                getFieldDecorator('password', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '密码不能为空'
                                        },
                                    ]

                                })(
                                    <Input placeholder="请输入密码" />
                                )
                            }
                        </FormItem>
                        <FormItem label="确认密码" {...formItemLayout}>
                            {
                                getFieldDecorator('repeat', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请再次输入密码',
                                        },
                                        {
                                            validator: this.passwordValidator,
                                        }
                                    ],
                                },
                                )(
                                    <Input placeholder="请输入密码" />
                                )
                            }
                        </FormItem>
                        <FormItem label="用户角色" {...formItemLayout}>
                            {
                                getFieldDecorator('userType', {
                                    initialValue: "0",
                                    rules: [{
                                        required: true,
                                        message: '用户角色必选'
                                    },
                                    ]
                                }
                                )(
                                    <RadioGroup>
                                        <Radio value="1">普通用户</Radio>
                                        <Radio value="2">商户</Radio>
                                        <Radio value="3">管理员</Radio>
                                    </RadioGroup>
                                )
                            }
                        </FormItem>
                        <FormItem label="手机号" {...formItemLayout}>
                            {
                                getFieldDecorator('phone', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '手机号不能为空'
                                        },
                                        {
                                            pattern: new RegExp('^\\d+$', 'g'),
                                            message: '手机号码必须为数字'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入手机号码" />
                                )
                            }
                        </FormItem>
                        <FormItem label="邮箱地址" {...formItemLayout}>
                            {
                                getFieldDecorator('email', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '邮箱地址不能为空'
                                        },
                                        {
                                            pattern: new RegExp(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/),
                                            message: '请输入正确的邮箱地址'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入邮箱地址" />
                                )
                            }
                        </FormItem>
                        <FormItem label="身份证号" {...formItemLayout}>
                            {
                                getFieldDecorator('idcard', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '需填写身份证'
                                        },
                                        {
                                            pattern: new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/),
                                            message: '请输入正确的身法证号'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入身份证号" />
                                )
                            }
                        </FormItem>
                        <FormItem label="" {...formItemLayout}>
                            {
                                getFieldDecorator('price', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '不能为空'
                                        },
                                    ]
                                })(
                                    <Input placeholder="请输入价格" />
                                )
                            }
                        </FormItem>
                        <FormItem label="溢价比例" {...formItemLayout}>
                            {
                                getFieldDecorator('premium', {
                                    initialValue: 0,
                                    rules: [
                                        {
                                            required: true,
                                            message: '不能为空'
                                        },
                                    ]
                                })(
                                    <Input placeholder="请输入溢价比例" />
                                )
                            }
                        </FormItem>
                        <FormItem label="定价类型" {...formItemLayout}>
                            {
                                getFieldDecorator("priceType", {
                                    initialValue: "FIXED",
                                    rules: [
                                        {
                                            required: true,
                                            message: '不能为空'
                                        },
                                    ]
                                })(
                                    <Select
                                    >
                                        <Option value='FIXED' >
                                            固定价格
                    </Option>
                                        <Option value="FLOAT" >
                                            浮动价格
                    </Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="参考价格" {...formItemLayout}>
                            {
                                getFieldDecorator('referPrice', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            pattern: new RegExp('^\\d+$', 'g'),
                                            message: '必须为数字'
                                        },
                                        {
                                            required: true,
                                            message: '不能为空'
                                        },
                                    ]
                                })(
                                    <Input placeholder="请输入参考价格" />
                                )
                            }
                        </FormItem>
                        <FormItem label="数量" {...formItemLayout}>
                            {
                                getFieldDecorator('count', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            pattern: new RegExp('^\\d+$', 'g'),
                                            message: '必须为数字'
                                        },
                                        {
                                            required: true,
                                            message: '不能为空'
                                        },
                                    ]
                                })(
                                    <Input placeholder="请输入发布数量" />
                                )
                            }
                        </FormItem>
                        <FormItem label="交易下限" {...formItemLayout}>
                            {
                                getFieldDecorator('minTradeAmount', {
                                    initialValue: 0,
                                    rules: [
                                        {
                                            pattern: new RegExp('^\\d+$', 'g'),
                                            message: '必须为数字'
                                        },
                                        {
                                            required: true,
                                            message: '不能为空'
                                        },
                                    ]
                                })(
                                    <Input placeholder="0 为不设限" />
                                )
                            }
                        </FormItem>
                        <FormItem label="交易上限" {...formItemLayout}>
                            {
                                getFieldDecorator('maxTradeAmount', {
                                    initialValue: 0,
                                    rules: [
                                        {
                                            pattern: new RegExp('^\\d+$', 'g'),
                                            message: '必须为数字'
                                        },
                                        {
                                            required: true,
                                            message: '不能为空'
                                        },
                                    ]
                                })(
                                    <Input placeholder="0 为不设限" />
                                )
                            }
                        </FormItem>
                        <FormItem label="收款方式" {...formItemLayout}>
                            {
                                getFieldDecorator("payTypeList", {
                                    initialValue: "Alipay",
                                    rules: [
                                        {
                                            required: true,
                                            message: '不能为空'
                                        },
                                    ]
                                })(
                                    <Select
                                    >
                                        <Option value='Alipay' >
                                            支付宝
                    </Option>
                                        <Option value="Wechat" >
                                            微信
                    </Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="广告类型" {...formItemLayout}>
                            {
                                getFieldDecorator('type', {
                                    initialValue: "SELL",
                                    rules: [{
                                        required: true,
                                        message: '类型必选'
                                    },
                                    ]
                                }
                                )(
                                    <Select
                                    >
                                        <Option value='BUY' >
                                            买入
                    </Option>
                                        <Option value="SELL" >
                                            卖出
                    </Option>
                                    </Select>
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
                            <Button type="primary" onClick={this.handleSubmit}>发布</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div >
        )
    }
}

// props 属性
const mapStateToProps = (state) => ({
    isLogin: state.isLogin,
    user: state.user
})

// props 方法
const mapDispatchToProps = (dispatch) => {
    return {
        saveLoginData(data) {
            dispatch(actionCreator.saveLoginData(data))
        },
    }
}

// 把逻辑方法与UI组件连接起来变成新容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(FormMyInfo))