import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import App from "./app"
import Common from "./common"
import Login from "./pages/form/login";
import Register from "./pages/form/register";
import MainPage from "./mainpage";
import Nomatch from "./pages/nomatch"
import { connect } from "react-redux"
import { getRoutes } from "./components/Api"

class IRouter extends Component {
  render() {
    return (
      <HashRouter>
        <App>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/common"
              render={() =>
                <Common>
                  <div>hello</div>
                </Common>
              }
            />
            <Route path="/"
              render={() => {

                return (
                  <MainPage>
                    <div>
                      <Switch>
                        <Route exact={true} path="/" >
                          <Redirect to="/home/" />
                        </Route>
                        {getRoutes(this.props.user.userType)}
                      </Switch>
                    </div>
                  </MainPage>)
              }}
            />
            <Route component={Nomatch} />
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