import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import App from "./app"
import Common from "./common"
import Login from "./pages/form/login";
import Register from "./pages/form/register";
import UserTable from "./pages/manager/userTable";
import adTable from "./pages/ad/"
import Admin from "./admin";
import Home from "./pages/home";
import Nomatch from "./pages/nomatch"

export default class IRouter extends Component {
  render() {
    return (
      <HashRouter>
        <App>
          <Switch>
            <Route exact={true} path="/" >
              <Redirect to="/admin/home/" />
            </Route>
            <Route path="/admin"
              render={() =>
                <Admin>
                  <div>
                    <Switch>
                      <Route exact={true} path="/admin" component={Home} />
                      <Route path="/admin/home" component={Home} />
                      <Route path="/admin/ads/:page" component={adTable} />
                      <Route path="/admin/manager/users" component={UserTable} />
                    </Switch>
                  </div>
                </Admin>
              }
            />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/common"
              render={() =>
                <Common>
                  <div>hello</div>
                </Common>
              }
            />
            <Route component={Nomatch} />
          </Switch>
        </App>
      </HashRouter >
    );
  }
}
