// src/components/div/index.js
import React from "react";
import MenuConfig from "./../../config/menuConfig"; //导入menuConfig这个文件
import { Menu } from "antd"; //导入子组件菜单
import "./index.scss";
import 'antd/dist/antd.css'

const SubMenu = Menu.SubMenu;

export default class NavLeft extends React.Component {
  componentWillMount() {
    //通过MenuConfig读取文件
    //通过递归(遍历)实现菜单(是一个List)的渲染
    const menuTreeNode = this.renderMenu(MenuConfig);
    this.setState(
      { menuTreeNode }
    )
    //通过setState存入state
  }

  //菜单渲染
  renderMenu = data => {
    return data.map(item => {
      //如果item有子元素,遍历自己,再次调用,直到子节点加载完毕
      if (item.children) {
        return (
          <SubMenu title={item.title} key={item.key}>
            {this.renderMenu(item.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item title={item.title} key={item.key}>
          <div to={item.key}>{item.title}</div>
        </Menu.Item>
      );
    });
  };

  render() {
    // var style = {
    //     backgroundColor:'red'
    // }
    return (
          <Menu mode="horizontal">
            {this.state.menuTreeNode}
          </Menu>
    );
  }
}