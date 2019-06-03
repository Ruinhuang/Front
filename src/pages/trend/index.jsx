import React from "react"
import { connect } from "react-redux"
import { actionCreator } from "../../redux/action"
import { Card, Button, Row, Col, Carousel } from "antd"
import { goToUrl } from "../../utils"
import TrendCharts from '../../components/Charts/trend'
import '../../style/common.scss'
class Trend extends React.Component {
  render = () => (
    <div>
      <Row>
        <Col span={18} >
          <TrendCharts />
        </Col>
        <Col span={6}>
          <Carousel
            autoplay
          >
            <h1>这里放第1张图</h1>
            <h1>这里放第2张图</h1>
            <h1>这里放第3张图</h1>
          </Carousel>
          <Button type="primary" block
            // 路由攔截器之後寫
            onClick={() => { this.props.isLogin ? goToUrl('/ads/index') : goToUrl('/login') }}
          >
            交易
            </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card title="簡介">
            <p>balbababaalbalbalbalblablalbalblablalblablalbalblalbalblablablalblabla</p>
            <p>balbababaalbalbalbalblablalbalblablalblablalbalblalbalblablablalblabla</p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
const mapStateToProps = (state) => ({
  isLogin: state.isLogin,
  user: state.user
})

export default connect(mapStateToProps)(Trend)