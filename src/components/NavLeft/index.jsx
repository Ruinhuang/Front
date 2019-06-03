import React from "react";
import { connect } from "react-redux"
import { Menu } from "antd"; //导入子组件菜单
import { NavLink } from 'react-router-dom'
import { getMenus } from '../Api'
import "./index.scss";

const SubMenu = Menu.SubMenu;

class NavLeft extends React.Component {

  //菜单渲染
  //通过递归(遍历)实现菜单(是一个List)的渲染
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
        <Menu.Item title={undefined} key={item.key}>
          <NavLink to={item.key}>{item.title}</NavLink>
        </Menu.Item>
      );
    });
  };

  render() {
    return (
      <Menu mode="horizontal" theme='dark'>
        {/* 依据redux中保存的用户类型返回导航菜单,并进行渲染 */}
        {this.renderMenu(getMenus(this.props.userType))}
      </Menu>
    );
  }
}
// props 属性
const mapStateToProps = (state) => ({
  isLogin: state.isLogin,
  user: state.user,
  userType: state.userType,
})

// 把逻辑方法与UI组件连接起来变成新容器组件
export default connect(mapStateToProps)(NavLeft)