import React from "react";
import { connect } from "react-redux"
import { actionCreator } from "../../redux/action"
import { Button, Card, Form, Icon, Input, Checkbox, message } from "antd";
import { goToUrl } from "../../utils"; //导入公共机制
import Ajax from '../../components/Ajax'

const FormItem = Form.Item;
class FormLogin extends React.Component {
  post = (formData) => {
    Ajax.ajax(
      'post',
      '/user-login',
      formData,
      // 'http://192.168.0.105:8080',
      'https://mook.sunlin.fun/mock/9',
    )
      .then(
        (res) => {
          this.props.saveLoginData(res.data)
          sessionStorage.setItem("token", res.data.token);
          if (this.autoLogin) {
            //将token存入localStorage
            localStorage.setItem("token", res.data.token);
          } else {
            localStorage.removeItem("token");
          }
          goToUrl('/home')
        }
      ).catch(() => { })
  }

  handleSubmit = () => {//绑定提交事件进行校验
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
                })(
                  <Input placeholder="请输入手机号码" />
                )
              }
            </FormItem>
            <FormItem
              label="密码"
              {...formItemLayout}
            >
              {
                getFieldDecorator('password', {
                  initialValue: '',
                  rules: [{
                    required: true,
                    message: '密码不能为空'
                  }]
                })(
                  <Input prefix={<Icon type="lock" />} type="password" placeholder="请输入密码" />
                )
              }

            </FormItem>
            <FormItem  {...offsetLayout}>
              {
                getFieldDecorator('autoLogin', {
                  valuePropName: 'checked',
                  initialValue: true,
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
              <Button type="primary" onClick={this.handleSubmit}>登录</Button>
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