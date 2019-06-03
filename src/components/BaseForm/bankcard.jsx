import React from "react";
import { connect } from "react-redux"
import { actionCreator } from "../../redux/action"
import { Button, Card, Form, Icon, Input, Checkbox, message } from "antd";
import Ajax from '../../components/Ajax'

const FormItem = Form.Item;
class FormBankCard extends React.Component {
    state = {
        BankInfo: {}
    }
    componentDidMount = () => {
        this.request()
    }

    request = () =>
        Ajax.ajax(
            'get',
            "/user/paytype/list",
            { "X-BM-USER-ID": this.props.user.userId },
            {},
            'http://45.76.146.27',
        ).then(
            res => {
                for (let item in res.data) {
                    // 目前只支持添加一個銀行卡
                    if (res.data[item].type === 'BANK') {
                        this.setState(() => ({ BankInfo: res.data[item] }))
                    }
                }
            })

    handleDelete = () =>
        Ajax.ajax(
            'get',
            "/user/paytype/deleteBankAccount",
            { "X-BM-USER-ID": this.props.user.userId },
            { paytypeId: this.state.BankInfo.id },
            'http://45.76.146.27',
        ).then(
            () => this.request()
        )


    handleSubmit = () => {
        console.log('button')
        const formData = this.props.form.getFieldsValue()// 可以(获取表单中)object对象
        this.props.form.validateFields((err, values) => {
            console.log(err)
            if (!err) {
                Ajax.ajax(
                    'post',
                    this.state.BankInfo.type ? "/user/paytype/updateBankAccount" : "/user/paytype/addBankAccount",
                    { "X-BM-USER-ID": this.props.user.userId },
                    {
                        "accountName": formData.accountName,
                        "accountNo": formData.accountNo,
                        "address": formData.address,
                        "bank": formData.bank,
                        "branch": formData.branch,
                        "id": formData.id,
                        "qrCodeUrl": formData.qrCodeUrl,
                        "subBranch": formData.subBranch,
                    },
                    'http://45.76.146.27',
                ).then(
                    () => this.request()
                )
            }
        })
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
                <Form
                    layout="horizontal"
                >
                    <FormItem label="支付账户名">
                        {
                            getFieldDecorator('accountName', {
                                initialValue: this.state.BankInfo.accountName,
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空'
                                    },
                                ]
                            })(
                                <Input placeholder="请输入支付账户名" />
                            )
                        }
                    </FormItem>
                    <FormItem label="支付账户号">
                        {
                            getFieldDecorator('accountNo', {
                                initialValue: this.state.BankInfo.accountNo,
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空'
                                    },
                                ]
                            })(
                                <Input placeholder="请输入支付账户号" />
                            )
                        }
                    </FormItem>
                    <FormItem label="开户行地址">
                        {
                            getFieldDecorator('address', {
                                initialValue: this.state.BankInfo.address,
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空'
                                    },
                                ]
                            })(
                                <Input placeholder="请输入开户行地址" />
                            )
                        }
                    </FormItem>
                    <FormItem label="银行名称">
                        {
                            getFieldDecorator('bank', {
                                initialValue: this.state.BankInfo.bank,
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空'
                                    },
                                ]
                            })(
                                <Input placeholder="请输入银行名称" />
                            )
                        }
                    </FormItem>
                    <FormItem label="分行">
                        {
                            getFieldDecorator('branch', {
                                initialValue: this.state.BankInfo.branch,
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空'
                                    },
                                ]
                            })(
                                <Input placeholder="请输入分行" />
                            )
                        }
                    </FormItem>
                    <FormItem label="id" style={{ display: "none" }}>
                        {
                            getFieldDecorator('id', {
                                initialValue: this.state.BankInfo.id,
                            })(
                                <Input placeholder="id" />
                            )
                        }
                    </FormItem>
                    <FormItem label="手机扫码账户二维码图片url">
                        {
                            getFieldDecorator('qrCodeUrl', {
                                initialValue: this.state.BankInfo.qrCodeUrl,
                            })(
                                <Input placeholder="请输入手机扫码账户二维码图片url" />
                            )
                        }
                    </FormItem>
                    <FormItem label="支行">
                        {
                            getFieldDecorator('subBranch', {
                                initialValue: this.state.BankInfo.subBranch,
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空'
                                    },
                                ]
                            })(
                                <Input placeholder="请输入支行" />
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
                        <Button type="primary" style={{ margin: 10 }} onClick={this.handleSubmit}>
                            {this.state.BankInfo.type ? "更新银行卡信息" : "添加银行卡信息"}
                        </Button>
                        <Button type="danger" style={{ margin: 10 }} onClick={this.handleDelete}>
                            刪除银行卡信息
                            </Button>
                    </FormItem>
                </Form>
            </div >
        )
    }
}

// props 属性
const mapStateToProps = (state) => ({
    isLogin: state.isLogin,
    user: state.user
})


// 把逻辑方法与UI组件连接起来变成新容器组件
export default connect(mapStateToProps)(Form.create()(FormBankCard))
