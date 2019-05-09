import React from "react";
import { connect } from "react-redux"
import { actionCreator } from "../../redux/action"
import Logo from "./logo.svg"
import { Row, Col, Button } from "antd";
import "./index.scss";
import { goToUrl } from "../../utils"; //导入公共机制


class Header extends React.Component {
    //声明 state变量 在setState之前要声明变量
    render() {
        return (
            <div className="header">
                <Row className="header-top">
                    <Col span={6} className="logo">
                        <img src={Logo} alt="" />
                        <span>Logo</span>
                    </Col>
                    <Col span={18} style={{ float: "right" }}>
                        {
                            this.props.isLogin ?
                                <span>
                                    <Button>{this.props.user.userName}</Button>
                                    <Button onClick={() => {
                                        goToUrl('/login')
                                        this.props.clearLoginData()
                                    }}
                                    >安全登出</Button>
                                </span>
                                :
                                <span>
                                    <Button onClick={() => goToUrl('/login')}>登录</Button>
                                    <Button onClick={() => goToUrl('/register')}>注册</Button>
                                </span>
                        }
                    </Col>
                </Row>
            </div>
        );
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
        clearLoginData() {
            dispatch(actionCreator.clearLoginData())
        },
    }
}

// 把逻辑方法与UI组件连接起来变成新容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Header)