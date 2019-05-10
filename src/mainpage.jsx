import React from "react";
import { Row } from "antd";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavLeft from "./components/NavLeft";
import { connect } from "react-redux"
import { actionCreator } from "./redux/action"
import './style/common.scss'
import 'antd/dist/antd.css'
import Ajax from './components/Ajax'

class MainPage extends React.Component {
  componentWillMount = () => {
    if (!this.props.isLogin) {
      if (localStorage.getItem('token')) {
        let token = localStorage.getItem('token')
        this.autoLoginByToken(token)
      } else if (sessionStorage.getItem('token')) {
        let token = sessionStorage.getItem('token')
        this.autoLoginByToken(token)
      } else {
        console.log('用户需手动登录')
      }
    }
  }
  autoLoginByToken = (token) =>
    new Promise((resolve, reject) => {
      Ajax.ajax(
        'post',
        '/user-login',
        { 'token': token },
        // 'http://192.168.0.105:8080',
        'https://mook.sunlin.fun/mock/9',
      )
        .then(
          (res) => {
            this.props.saveLoginData(res.data)
            sessionStorage.setItem("token", res.data.token);
            return resolve(res.data)
          }
        ).catch((error) => {
          console.log("token 自动登录失败", error)
        })
    })
  render() {
    return (
      <Row className="container" >
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
export default connect(mapStateToProps, mapDispatchToProps)(MainPage)