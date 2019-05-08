import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import App from "./app"
import Common from "./common"
import Login from "./pages/form/login";
import Register from "./pages/form/register";
import UserTable from "./pages/manager/userTable";
import OrderTable from "./pages/manager/orderTable";
import PermissionTable from "./pages/manager/permissionTable";
import adTable from "./pages/ad/"
import MainPage from "./mainpage";
import Home from "./pages/home";
import Nomatch from "./pages/nomatch"

export default class IRouter extends Component {
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
              render={() =>
                <MainPage>
                  <div>
                    <Switch>
                      <Route exact={true} path="/" >
                        <Redirect to="/home/" />
                      </Route>
                      <Route path="/home" component={Home} />
                      <Route path="/ads/:page" component={adTable} />
                      <Route path="/manager/users" component={UserTable} />
                      <Route path="/manager/orders" component={OrderTable} />
                      <Route path="/manager/permission" component={PermissionTable} />
                    </Switch>
                  </div>
                </MainPage>
              }
            />
            <Route component={Nomatch} />
          </Switch>
        </App>
      </HashRouter >
    );
  }
}
