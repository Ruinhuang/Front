import React from "react";
import { Row } from "antd";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavLeft from "./components/NavLeft";
import './style/common.scss'
import 'antd/dist/antd.css'
import { autoLoginByToken } from "./components/Api"

export default class MainPage extends React.Component {
  componentWillMount = () => {
    if (localStorage.getItem('token')) {
      let token = localStorage.getItem('token')
      autoLoginByToken(token)
    } else if (sessionStorage.getItem('token')) {
      let token = sessionStorage.getItem('token')
      autoLoginByToken(token)
    } else {
      console.log('用户需手动登录')
    }
  }
  render() {
    return (
      <Row className="container">
        <Row className="main">
          <Header />
          <Row className="nav-left">
            <NavLeft />
          </Row>
          <Row className="content">
            {this.props.children}
          </Row>
          <Footer />
        </Row>
      </Row>
    );
  }
}
