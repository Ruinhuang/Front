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
  state = {
    apply: {},
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });


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

  getApplyStatus = () => {
    Ajax.ajax(
      'get',
      '/normal/user/apply/query/',
      {},
      {
        userId: this.props.user.userId
      },
      "http://207.148.65.10:8080",
      // "http://192.168.0.105:8080",
    )
      .then(
        (res) => {
          this.setState(() => ({
            apply: res.data === null ? {} : res.data
          }))
        }
      )
  }

  componentDidMount = () => {
    this.getWallentInfo()
    this.getApplyStatus()
  }

  handleChangePassword = () => {//绑定提交事件进行校验
    const password = this.props.form.getFieldsValue().password
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const formData = { password, token: this.props.token, }
        Ajax.ajax('post', '/changePassword', {}, formData, "https://mook.sunlin.fun/mock/9/").then((res) => {
          localStorage.removeItem("token")
          sessionStorage.removeItem("token")
          this.props.saveLoginData(res.data)
          sessionStorage.setItem("token", res.data.token)
          message.success('修改成功')
        })
      }
    }
    )
  }

  handleBusinessApplyButtonClick = () => {
    const idCode = this.props.form.getFieldsValue().idCode
    const idCodePattern = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/
    if (!idCodePattern.test(idCode)) {
      message.info("请先输入正确的身份证号码")
    } else {
      Ajax.ajax(
        'post',
        '/user/apply/sale',
        {},
        { idCode, status: "1", userId: this.props.user.userId },
        "http://207.148.65.10:8080"
        // "http://192.168.0.105:8080"
      ).then(
        () => {
          message.success('已发起申请')
          this.getApplyStatus()
        }
      )
    }
  }

  passwordValidator = (rule, value, callback) => {
    let password = this.props.form.getFieldsValue().password
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
    const buttonTextMap = {
      undefined: "申请成为商户",
      "0": "申请成为商户",
      "1": "申请待审批",
      "2": "已认证",
      "3": "申请被驳回",
    }

    return (
      <div>
        <Card title="我的信息"
        >
          <Form
            layout="horizontal"
          >
            <FormItem label="用户名" {...formItemLayout}>
              <Input disabled value={this.props.user.userName} />
            </FormItem>
            <FormItem label="新密码" {...formItemLayout}>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '必填'
                    },
                  ],
                })(
                  <Input.Search
                    placeholder="请输入新密码"
                    enterButton="修改密码"
                    onSearch={this.handleChangePassword}
                  />
                )
              }
            </FormItem>
            <FormItem label="用户角色" {...formItemLayout}>
              <Input disable placeholder={roleMap[this.props.user.userType]} />
            </FormItem>
            <FormItem label="手机号" {...formItemLayout}>
              <Input disabled placeholder={this.props.user.phone} />
            </FormItem>
            <FormItem label="邮箱地址" {...formItemLayout}>
              <Input disabled placeholder={this.props.user.email} />
            </FormItem>
            <FormItem label="身份证号" {...formItemLayout}>
              {
                getFieldDecorator('idCode', {
                  initialValue: this.state.idCode,
                  rules: [
                    {
                      pattern: new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/),
                      message: '请输入正确的身法证号'
                    }
                  ]
                })(
                  <Input.Search
                    placeholder={this.state.apply ? this.state.apply.idCode : "申请商户需要身份证信息"}
                    enterButton={buttonTextMap[this.state.apply.status]}
                    disabled={parseInt(this.state.apply.status) > 0}
                    onSearch={this.handleBusinessApplyButtonClick}
                  />
                )
              }
            </FormItem>
          </Form>
        </Card>
        <Card title="我的钱包"
          style={{
            display: "-webkit -flex",
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