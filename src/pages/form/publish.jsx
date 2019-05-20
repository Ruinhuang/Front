import React from "react";
import { connect } from "react-redux"
import { actionCreator } from "../../redux/action"
import { Button, Card, Form, Icon, Input, Checkbox, message, Radio } from "antd";
import { goToUrl } from "../../utils"; //导入公共机制
import Ajax from '../../components/Ajax'

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class FormPublish extends React.Component {
  post = (formData) => {
    Ajax.ajax(
      'post',
      '/user-login',
      {},
      formData,
      "http://207.148.65.10:8080",
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
        <Card title="发表广告"
        >
          <Form
            layout="horizontal"
          >
            <FormItem label="金额" {...formItemLayout}>
              {
                getFieldDecorator('phone', {
                  initialValue: '',
                  rules: [
                    {
                      pattern: new RegExp('^\\d+$', 'g'),
                      message: '金额必须为数字'
                    },
                    {
                      required: true,
                      message: '金额不能为空'
                    },
                  ]
                })(
                  <Input placeholder="请输入发布金额" />
                )
              }
            </FormItem>
            <FormItem label="发布类型" {...formItemLayout}>
              {
                getFieldDecorator('adType', {
                  initialValue: "0",
                  rules: [{
                    required: true,
                    message: '类型必选'
                  },
                  ]
                }
                )(
                  <RadioGroup>
                    <Radio value={0}>买入</Radio>
                    <Radio value={1}>卖出</Radio>
                  </RadioGroup>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(FormPublish))