import React from "react";
import { Row } from "antd";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavLeft from "./components/NavLeft";
import './style/common.scss'
import 'antd/dist/antd.css'
export default class Admin extends React.Component {
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
