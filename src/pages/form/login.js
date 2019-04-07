import React from "react";
import { Button, Card, Form, Icon, Input, message } from "antd";

const FormItem = Form.Item;
class FormLogin extends React.Component {
  handleSubmit = () => {//绑定提交事件进行校验
    let userInfo = this.props.form.getFieldsValue();//object对象,包含表单中所有信息
    // 校验表单输入是否符合规则， 不符合err会包含信息, 校验通过err为空
    this.props.form.validateFields((err, values) => {
      if (!err) {// ${}  是变量
        message.success(`${userInfo.userName} 欢迎登录`)
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
        <Card title="登录"
        >
          <Form
            layout="horizontal"
          >
            <FormItem
              label="帐号"
              {...formItemLayout}
            >
              {
                getFieldDecorator('userName', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '用户名不能为空'
                    },
                    {
                      min: 5, max: 10,
                      message: '长度不在范围内'
                    },
                    {
                      pattern: new RegExp('^\\w+$', 'g'),
                      message: '用户名必须为字母或数字'
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="user" />}
                    placeholder="请输入用户名"
                  />
                )
              }

            </FormItem>
            <FormItem
              label="密码"
              {...formItemLayout}
            >
              {
                getFieldDecorator('userPwd', {
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

export default Form.create()(FormLogin);