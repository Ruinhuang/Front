import React from "react";
import { Row, Col } from "antd";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavLeft from "./components/NavLeft";
import './style/common.scss'
export default class Admin extends React.Component {
  render() {
    return (
      <Row className="container">
        <Row className="main">
          {/* Right */}
          <Header />
          <Row className="nav-left">
            <NavLeft />
          </Row>
          <Row className="content">
            {/*content*/}
            {/* <Home/> */}
            {this.props.children}
          </Row>
          <Footer>Footer</Footer>
        </Row>
      </Row>
    );
  }
}
