import React, { Component } from 'react';
import { HashRouter, Route, Switch } from "react-router-dom";
import Login from "./pages/form/login";
import Register from "./pages/form/register";
import UserTable from "./pages/table/userTable";
import Admin from "./admin";
import Home from "./pages/home";
import Nomatch from "./pages/nomatch"

export default class IRouter extends Component {
  render() {
    return (
      <HashRouter>
        <Admin>
          <div>
            <Switch>
              <Route exact={true} path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/home" component={Home} />
              <Route path="/user" component={UserTable} />
              <Route component={Nomatch} />
            </Switch>
          </div>
        </Admin>
      </HashRouter >
    );
  }
}
