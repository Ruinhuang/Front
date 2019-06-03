import React from "react";
import { connect } from "react-redux"
import { actionCreator } from "../../redux/action"
import { Row, Col, Button, Card, Form, Select, Input, Checkbox, message, Radio, Upload, Icon, Modal } from "antd";
import UploadPic from '../../components/UploadPic'
import BankCard from '../../components/BaseForm/bankcard'
import { goToUrl } from "../../utils";
import Ajax from '../../components/Ajax'
import '../../style/common.scss'
const Option = Select.Option
const RadioGroup = Radio.Group
const FormItem = Form.Item
class FormMyInfo extends React.Component {
    state = {}

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });

    post = (formData) => {
        Ajax.ajax(
            'post',
            '/user-login',
            { "X-BM-USER-ID": this.props.token },
            formData,
            "https://mook.sunlin.fun/mock/9/"
        )
            .then(
                (res) => {
                }
            ).catch(() => { })
    }
    getWallentInfo = () => {
        Ajax.ajax(
            'get',
            '/user/point/query/',
            {},
            {
                token: sessionStorage.getItem('token')
            },
            "http://207.148.65.10:8080",
        )
            .then(
                (res) => {
                    this.setState(() => ({
                        count: res.data.point,
                        frozenAmount: res.data.frozenPoint,
                    }))
                }
            ).catch(() => { })
    }

    componentDidMount = () => {
        this.getWallentInfo()
    }
    handleSubmit = () => {//绑定提交事件进行校验
        let formData = this.props.form.getFieldsValue()// 可以(获取表单中)object对象
        this.props.form.validateFields((err, values) => {
            if (!err) {// ${}  是变量
                this.post(formData)
            }
        })
    }
    handleUserUpdateButtonClick = () => {
        const idcard = this.props.form.getFieldsValue().idcard
        console.log(idcard)
        if (isNaN(idcard) || idcard === undefined) {
            message.info("请先输入正确的身份证号码")
        }
    }

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
        const roleMap = {
            "1": "普通用户",
            "2": "商户",
            "3": "管理员",
        }

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
                                    initialValue: this.props.user.userName,
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
                        <FormItem label="新密码" {...formItemLayout}>
                            {
                                getFieldDecorator('password', {
                                    initialValue: this.props.user.password,
                                })(
                                    <Input placeholder="请输入密码" />
                                )
                            }
                        </FormItem>
                        <FormItem label="确认密码" {...formItemLayout}>
                            {
                                getFieldDecorator('repeat', {
                                    initialValue: this.props.user.password,
                                    rules: [
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
                                    initialValue: roleMap[this.props.user.userType],
                                    rules: [{
                                        required: true,
                                        message: '用户角色必选'
                                    },
                                    ]
                                }
                                )(
                                    <Select>
                                        <Option value={0}>普通用户</Option>
                                        <Option value={1}>管理员</Option>
                                        <Option value={2}>商户</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="手机号" {...formItemLayout}>
                            {
                                getFieldDecorator('phone', {
                                    initialValue: this.props.user.phone,
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
                                    initialValue: this.props.user.email,
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
                                    initialValue: this.props.user.idcard,
                                    rules: [
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
                        <FormItem
                            style={{
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: 200,
                            }}
                        >
                            <Button type="primary" style={{ margin: 10 }}>更新</Button>
                            <Button type="primary" style={{ margin: 10 }} onClick={this.handleUserUpdateButtonClick}>申请成为商户</Button>
                        </FormItem>
                    </Form>
                </Card>
                <Card title="我的钱包"
                    style={{
                        display: "-webkit - flex",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Row>
                        <Col span={8}>
                            <Card title="积分"
                                style={{
                                    display: "inline-block",
                                    margin: 50,
                                }}
                            >
                                <p>总积分：{this.state.count}</p>
                                <p>冻结积分：{this.state.frozenAmount}</p>
                                <Button
                                    onClick={this.getWallentInfo}
                                >
                                    刷新积分
                            </Button>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="銀行卡"
                                style={{
                                    display: "inline-block",
                                    margin: 50,
                                }}
                            >
                                <BankCard />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="微信二维码"
                                style={{
                                    display: "inline-block",
                                    margin: 50,
                                }}
                            >
                                <UploadPic payType="WECHAT_PAY" />
                            </Card>
                            <Card title="支付宝二维码"
                                style={{
                                    display: "inline-block",
                                    margin: 50,
                                }}
                            >
                                <UploadPic payType="ALI_PAY" />
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </div >
        )
    }
}

// props 属性
const mapStateToProps = (state) => ({
    isLogin: state.isLogin,
    user: state.user,
    token: state.token,
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