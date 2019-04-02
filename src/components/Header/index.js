// src/components/Header/index.js
import React from "react";
import { Row, Col, Modal } from "antd";
import "./index.scss";
import Util from "../../utils/utils"; //导入公共机制
// import axios from "../axios"; //引入axios组件


class Header extends React.Component {
    //声明 state变量 在setState之前要声明变量
    state = {};

    componentWillMount() {
        this.setState({
            userName: "testUser",
        });
        /*
            创建定时器,每隔一秒获取时间
            * 获取时间的方法
            */
        setInterval(() => {
            // new Date();
            let sysTime = Util.formateDate(new Date().getTime());
            this.setState({
                sysTime
            });
        }, 1000);
    }



    showExitConfirm = () => {
        Modal.confirm({
            title: "是否确定退出系统?",
            onOk() {
                window.location.href = "/#/login";
            },
            onCancel() {
                console.log("Cancel");
            }
        });
    };

    render() {
        return (
            <div className="header">
                <Row className="header-top">
                    <Col span={6} className="logo">
                        <img src="/assets/logo-ant.svg" alt="" />
                        <span>this is a LOGO</span>
                    </Col>
                    <Col span={18}>
                        <span>欢迎, {this.state.userName} </span>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Header
