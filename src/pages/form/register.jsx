import React from 'react';
import {
  Card,
  Form,
  Button,
  Input,
  Radio,
  Checkbox,
  message,
} from "antd";
import Ajax from '../../components/Ajax'
import '../../style/common.scss'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class FormRegister extends React.Component {

  post = (formData) => {
    Ajax.ajax(
      'post',
      '/user-register',
      formData,
      'http://192.168.0.105:8080',
    )
      .then(() => { }).catch(() => { })
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
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        userImg: imageUrl,
        loading: false,
      }));
    }
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
                getFieldDecorator('username', {
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
                getFieldDecorator('role', {
                  initialValue: "0",
                  rules: [{
                    required: true,
                    message: '用户角色必选'
                  },
                  ]
                }
                )(
                  <RadioGroup>
                    <Radio value={0}>普通用户</Radio>
                    <Radio value={1}>商户</Radio>
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
              <Button type="primary" onClick={this.handleSubmit}>注册</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    )
  }
}

export default Form.create()(FormRegister);
