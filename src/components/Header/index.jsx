// src/components/Header/index.js
import React from "react";
import { Row, Col, Button } from "antd";
import "./index.scss";
import { formateDate } from "../../utils"; //导入公共机制
// import axios from "../axios"; //引入axios组件


class Header extends React.Component {
    //声明 state变量 在setState之前要声明变量
    state = {
        isLogin: false,
        sysTime: undefined,
        userName: "用户007",
    };

    componentWillMount() {
        /*
            创建定时器,每隔一秒获取时间
            * 获取时间的方法
            */
        setInterval(() => {
            // new Date();
            let sysTime = formateDate(new Date().getTime());
            this.setState({
                sysTime
            });
        }, 1000);
    }

    render() {
        return (
            <div className="header">
                <Row className="header-top">
                    <Col span={6} className="logo">
                        <img src="/assets/logo-ant.svg" alt="" />
                        <span>{this.state.sysTime}</span>
                    </Col>
                    <Col span={18} style={{ float: "right" }}>
                        {
                            this.state.isLogin ?
                                <span>{this.state.userName}</span>
                                :
                                <span>

                                    <Button
                                        onClick={
                                            () => {
                                                window.location.href = "/#/login"
                                            }
                                        }
                                    >
                                        登录
                        </Button>
                                    <Button
                                        onClick={
                                            () => {
                                                window.location.href = "/#/register"
                                            }
                                        }
                                    >
                                        注册
                        </Button>
                                </span>
                        }
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Header
