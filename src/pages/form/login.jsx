import React from "react";
import { connect } from "react-redux"
import { actionCreator } from "../../redux/action"
import { Select, Button, Card, Form, Icon, Input, Checkbox, message } from "antd";
import { goToUrl, getOptionList } from '../../utils'
import { areaList } from '../../config/area'
import Ajax from '../../components/Ajax'
const FormItem = Form.Item;

class FormLogin extends React.Component {
  state = {
    usePassword: true,
    captchaLoading: false,
    time: 19,
  }
  sendSMS = (phoneNumber) => {
    Ajax.ajax(
      'get',
      `/get/sms`,
      {},
      { phone: phoneNumber.toString(), type: "1" },
      "http://207.148.65.10:8080",
    )
  }
  count = () => {
    let { time } = this.state;
    let siv = setInterval(() => {
      this.setState({ time: (time--) }, () => {
        if (time <= -1) {
          clearInterval(siv)　　//倒计时( setInterval() 函数会每秒执行一次函数)，用 clearInterval() 来停止执行:
          this.setState((prevState) => ({ captchaLoading: false, time: prevState.time }))
        }
      });
    }, 1000);
  }

  changeLoginType = () => {
    this.setState(
      (prevState) => ({
        usePassword: !prevState.usePassword,
      })
    )
  }
  handleCaptchaButton = () => {
    const phone = this.props.form.getFieldsValue().phone
    if (!isNaN(phone) && phone !== undefined) {
      this.setState(() => ({ captchaLoading: true }))
      this.count()
      this.sendSMS(phone)
    } else {
      message.info("请先输入正确的手机号码")
    }
  }
  post = (formData) => {
    Ajax.ajax(
      'post',
      this.state.usePassword ? "/user-login" : "/user-sms-login",
      {},
      formData,
      "http://207.148.65.10:8080",
    )
      .then(
        (res) => {
          // 先清除之前残留的token缓存
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          this.props.saveLoginData(res.data) // token, userName, userType => redux store
          sessionStorage.setItem("token", res.data.token);
          if (this.autoLogin) {
            //将token存入localStorage
            localStorage.setItem("token", res.data.token);
          }
          this.state.usePassword ?
            goToUrl('/home')
            :
            goToUrl('/user/info')
        }
      ).catch(() => { })
  }

  handleLoginButtonClick = () => {//绑定提交事件进行校验
    let formData = this.props.form.getFieldsValue()// 可以(获取表单中)object对象
    this.props.form.validateFields((err, values) => {
      if (!err) {// ${}  是变量
        this.autoLogin = formData.autoLogin
        this.post(formData)
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const optionList = getOptionList(areaList)
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
        <Card title="登录"
        >
          <Form
            layout="horizontal"
          >
            <FormItem label="手机所在地"  {...formItemLayout}>
              {
                getFieldDecorator('areaCode', {
                  initialValue: "0086",
                  rules: [{
                    required: true,
                    message: '必选'
                  },
                  ]
                })(
                  <Select >
                    {optionList}
                  </Select>
                )
              }
            </FormItem>
            <FormItem label="手机号" {...formItemLayout}>
              {
                getFieldDecorator('phone', {
                  initialValue: '',
                  rules: [
                    {
                      pattern: new RegExp('^\\d+$', 'g'),
                      message: '手机号码必须为字母'
                    },
                    {
                      required: true,
                      message: '手机号不能为空'
                    },
                  ]
                })
                  (this.state.usePassword ?
                    <Input prefix={<Icon type="phone" />} placeholder="请输入手机号码" />
                    :
                    <Input.Search
                      prefix={<Icon type="phone" />}
                      placeholder="请输入手机号码"
                      enterButton={this.state.captchaLoading ? this.state.time + '秒后可再次发送' : '发送短信验证'}
                      disabled={this.state.captchaLoading}
                      onSearch={this.handleCaptchaButton}
                    />
                  )
              }
            </FormItem>
            <FormItem
              label={this.state.usePassword ? "密码" : "短信验证码"}
              {...formItemLayout}
            >
              {
                getFieldDecorator(
                  this.state.usePassword ? 'password' : 'captcha',
                  {
                    initialValue: '',
                    rules: [{
                      required: true,
                      message: '密码不能为空'
                    }]
                  })
                  (this.state.usePassword ?
                    <Input.Password prefix={<Icon type="lock" />} type="password" placeholder="请输入密码" />
                    :
                    <Input prefix={<Icon type="mobile" />} type="text" placeholder="请输入短信验证码" />
                  )
              }

            </FormItem>
            <FormItem  {...offsetLayout}>
              {
                getFieldDecorator('autoLogin', {
                  valuePropName: 'checked',
                  initialValue: false,
                })(
                  <Checkbox>自动登录</Checkbox>
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
              <Button type="primary" style={{ margin: 10 }} onClick={this.handleLoginButtonClick}>
                登录
                </Button>
              <Button type="primary" style={{ margin: 10 }} onClick={() => goToUrl('/register')}>去注册</Button>
              <Button size="small" style={{ margin: 10 }}
                className="link-button"
                onClick={this.changeLoginType}>
                {this.state.usePassword ?
                  "使用短信验证"
                  : "使用密码验证"
                }
              </Button>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(FormLogin))
