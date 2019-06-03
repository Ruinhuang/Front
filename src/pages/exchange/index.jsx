import React from "react"
import '../../style/common.scss'
import Ajax from '../../components/Ajax'
import { InputNumber, Form, Card, Row, Col } from "antd";
export default class Exchange extends React.Component {
  render = () => (
    <Row>
      <Col span={12}>
        <Card title='客服二維碼'>
          <img src="https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike80%2C5%2C5%2C80%2C26/sign=fa9140accd95d143ce7bec711299e967/2934349b033b5bb571dc8c5133d3d539b600bc12.jpg" alt="客服" />
        </Card>
      </Col>
      <Col span={12}>
        <Card title='温馨提示'>
          <FormHelper />
        </Card>
      </Col>
    </Row>
  )
}
const FormItem = Form.Item;
class FormHelper extends React.Component {
  state = {
    exchangeRate: 0,
    feeRate: 0,
  }
  componentDidMount = () => {
    Ajax.ajax(
      'get',
      '/coin/query',
      {},
      {
        coinName: "XRB"
      },
      'http://45.76.146.27',
    )
      .then(
        (res) => {
          this.setState(
            () => ({
              feeRate: res.data.feeRate,
              exchangeRate: res.data.exchangeRate,
            })
          )
        }
      )
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form
          layout="horizontal"
        >
          <FormItem>
            <span>我需要兑换</span>
            {
              getFieldDecorator('pointNumber', {
                initialValue: 0,
              })(
                <InputNumber step="0.01" placeholder="海贝数" />
              )
            }
            <span>海贝，需要
             <b>{this.props.form.getFieldsValue().pointNumber / this.state.exchangeRate}</b>
              XRB, 手续费
             <b>{this.props.form.getFieldsValue().pointNumber * this.state.feeRate}</b>
              海贝，到手
             <b>{this.props.form.getFieldsValue().pointNumber - this.props.form.getFieldsValue().pointNumber * this.state.feeRate}</b>
              海贝 </span>
          </FormItem>
          <FormItem>
            <span>我需要兑换</span>
            {
              getFieldDecorator('XRBNumber', {
                initialValue: 0,
              })(
                <InputNumber step="0.01" placeholder="XRB数" />
              )
            }
            <span>XRB，需要<b>
              {this.props.form.getFieldsValue().XRBNumber * (1 + this.state.feeRate) * this.state.exchangeRate}
            </b>海贝, 其中包含手续费 <b>
                {this.props.form.getFieldsValue().XRBNumber * this.state.exchangeRate * this.state.feeRate}
              </b>海贝 </span>
          </FormItem>
        </Form>
      </div >
    )
  }
}

FormHelper = Form.create()(FormHelper)
