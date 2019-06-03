import React from "react";
import { connect } from "react-redux"
import { actionCreator } from "../../redux/action"
import { Button, Card, Form, Icon, Select, Input, Checkbox, message, Radio } from "antd";
import { goToUrl } from "../../utils"; //导入公共机制
import Ajax from '../../components/Ajax'
const Option = Select.Option
const RadioGroup = Radio.Group
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group;
class FormPublish extends React.Component {
  state = {
    payTypes: [],
  }

  post = (formData) => {
    Ajax.ajax(
      'post',
      '/ad/createPublish',
      { "X-BM-USER-ID": this.props.user.userId },
      formData,
      "http://45.76.146.27"
    )
      .then(
        () => {
          message.success("发布成功")
        }
      ).catch(() => { })
  }

  componentWillMount = () => {
    Ajax.ajax(
      'get',
      '/user/paytype/list',
      { "X-BM-USER-ID": this.props.user.userId },
      {},
      "http://45.76.146.27",
    ).then(
      (data) => {
        const list = data.data.map(
          (item) => ({ label: item.typeName, value: item.id })
        )
        this.setState(() => {
          return { payTypes: list }
        })
      }
    ).catch()
  }

  handleSubmit = () => {//绑定提交事件进行校验
    let formData = this.props.form.getFieldsValue()// 可以(获取表单中)object对象
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //payTypeList required string like "[43,45]"  
        formData.payTypeList = `[${formData.payTypeList.toString()}]`
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
        <Card title="发布广告"
        >
          <Form
            layout="horizontal"
          >
            <FormItem label="币种" {...formItemLayout}>
              {
                getFieldDecorator('coinId', {
                  initialValue: 1,
                  rules: [
                    {
                      required: true,
                      message: '不能为空'
                    },
                  ]
                })(
                  <RadioGroup>
                    <Radio value={1}>XRB</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
            <FormItem label="价格" {...formItemLayout}>
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
            <FormItem label="溢价比例" {...formItemLayout} 
	    style={{display:"none"}}
	    >
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
            <FormItem label="定价类型" {...formItemLayout}
	    style={{display:"none"}}
	    >
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
            <FormItem label="参考价格" {...formItemLayout}
	    style={{display:"none"}}
	    >
              {
                getFieldDecorator('referPrice', {
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
                  rules: [
                    {
                      required: true,
                      message: '不能为空'
                    },
                  ]
                })(
                  <CheckboxGroup options={this.state.payTypes} />

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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(FormPublish))
