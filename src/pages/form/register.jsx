import React from 'react';
import {
  Card,
  Form,
  Button,
  Input,
  Radio,
  Checkbox,
  message,
  Select,
} from "antd";
import Ajax from '../../components/Ajax'
import '../../style/common.scss'
import { goToUrl } from '../../utils'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option

class FormRegister extends React.Component {
  state = {
    time: 19,
    captchaLoading: false,
  }

  handleCaptchaButton = () => {
    const phone = this.props.form.getFieldsValue().phone
    if (!isNaN(phone) && phone !== undefined) {
      this.setState(() => ({ captchaLoading: true }))
      this.count()
    } else {
      message.info("请先输入正确的手机号码")
    }
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

  post = (formData) => {
    Ajax.ajax(
      'post',
      '/user-register',
      {},
      formData,
      "http://207.148.65.10:8080",
    )
      .then(() => {
        message.info("注册成功")
        goToUrl('/login')
      })
    // .catch(() => { })
  }

  passwordValidator = (rule, value, callback) => {
    let password = this.props.form.getFieldsValue().password
    console.log(rule, value, password)
    if (value && value !== password) {
      callback('密码输入不一致！')
    }
    callback()
  }

  handleSubmit = () => {
    let formData = this.props.form.getFieldsValue();// 可以(获取表单中)object对象
    this.post(formData)


  };

  componentDidMount = () => {

  }

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
    const offsetLayout = {
      wrapperCol: {
        xs: 24,
        sm: {
          span: 12,
          offset: 4
        }
      }
    };


    return (
      <div>
        <Card title="注册">
          <Form layout="horizontal">
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
            <FormItem label="用户角色" {...formItemLayout} style={{ display: "none" }}>
              {
                getFieldDecorator('userType', {
                  initialValue: "1",
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
            <FormItem label="手机所在地"  {...formItemLayout}>
              {
                getFieldDecorator('area', {
                  initialValue: "0086",
                  rules: [{
                    required: true,
                    message: '必选'
                  },
                  ]
                })(
                  <Select >
                    <Option value='0082'>
                      韩国(0082)
                    </Option>
                    <Option value='0086'>
                      中国大陆(0086)
                    </Option>
                    <Option value='0081'>
                      日本(0081)
                    </Option>
                    <Option value='001'>
                      美国(001)
                    </Option>
                  </Select>
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
            <FormItem label="手机号" {...formItemLayout}>
              {
                getFieldDecorator('phone', {
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
              <Button type="primary"
                loading={this.state.captchaLoading}
                onClick={this.handleCaptchaButton}
              >
                {this.state.captchaLoading ? this.state.time + '秒后可再次发送' : '发送短信验证'}
              </Button>
            </FormItem>
            <FormItem label="验证码" {...formItemLayout}>
              {
                getFieldDecorator('captcha', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '验证码不能为空'
                    },
                  ]
                }
                )(
                  <Input placeholder="请输入验证码" />
                )
              }
            </FormItem>
            <FormItem label="邀请码" {...formItemLayout}>
              {
                getFieldDecorator('inCode', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '邀请码不能为空'
                    },
                  ]
                })(
                  <Input placeholder="请输入邀请码" />
                )
              }
            </FormItem>
            <FormItem label="身份证号" {...offsetLayout} style={{ display: "none" }}>
              {
                getFieldDecorator('idcard', {
                  initialValue: '',
                  rules: [
                    {
                      required: false,
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
            <FormItem {...offsetLayout}>
              {
                getFieldDecorator('register', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox>我已阅读过<button className="link-button" href="#" >协议</button></Checkbox>
                )
              }
            </FormItem>
            <FormItem {...offsetLayout}>
              <Button type="primary" style={{ margin: 10 }} onClick={this.handleSubmit}>注册</Button>
              <Button type="primary" style={{ margin: 10 }} onClick={() => goToUrl('/login')}>去登录</Button>
            </FormItem>
          </Form>
        </Card>
      </div >
    )
  }
}

export default Form.create()(FormRegister);
