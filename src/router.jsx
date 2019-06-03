import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import App from "./app"
import Common from "./common"
import Login from "./pages/form/login";
import Home from "./pages/home";
import Trend from "./pages/trend";
import Register from "./pages/form/register";
import MainPage from "./mainpage";
import Nomatch from "./pages/nomatch"
import { connect } from "react-redux"
import { getRoleRoutes } from "./components/Api"

class IRouter extends Component {
  render() {
    return (
      <HashRouter>
        <App>
          <Switch>
            <Route path="/common"
              render={() =>
                <Common>
                  <div>hello</div>
                </Common>
              }
            />
            <Route path="/"
              render={() =>
                <MainPage>
                  <div>
                    <Switch>
                      <Route exact={true} path="/" >
                        <Redirect to="/home/" />
                      </Route>
                      {/* 所有人都能看到這4個頁面 */}
                      <Route path="/login" component={Login} />
                      <Route path="/register" component={Register} />
                      <Route key="/home" path="/home" component={Home} />
                      <Route key="/trend" path="/trend" component={Trend} />
                      {getRoleRoutes(this.props.user.userType)}
                      <Route component={Nomatch} />
                    </Switch>
                  </div>
                </MainPage>
              }
            />
          </Switch>
        </App>
      </HashRouter >
    );
  }
}

// props 属性
const mapStateToProps = (state) => ({
  user: state.user
})

// 把逻辑方法与UI组件连接起来变成新容器组件
export default connect(mapStateToProps)(IRouter)