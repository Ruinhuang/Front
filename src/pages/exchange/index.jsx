import React from "react"
import '../../style/common.scss'
import { Card, Row, Col } from "antd";
export default class Exchange extends React.Component {
    render = () => (
        <Row>
            <Col span={12}>
                <Card title='客服二維碼'>
                    <img src="https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike80%2C5%2C5%2C80%2C26/sign=fa9140accd95d143ce7bec711299e967/2934349b033b5bb571dc8c5133d3d539b600bc12.jpg" alt="客服" />
                </Card>
            </Col>
            <Col span={12}>
                <Card title='這邊放什麽？'>
                </Card>
            </Col>
        </Row>
    )
}