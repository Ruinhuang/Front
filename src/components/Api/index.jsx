import React from 'react'
import UserTable from "../../pages/manager/userTable";
import AdTable from "../../pages/manager/adTable";
import OrderTable from "../../pages/manager/orderTable";
import PermissionTable from "../../pages/manager/permissionTable";
import MyInfo from "../../pages/user/myInfo";
import MyAds from "../../pages/user/myAds";
import MyOrders from "../../pages/user/myOrders";
import adTable from "../../pages/ad/"
import Home from "../../pages/home";
import Publish from "../../pages/form/publish";
import { Route } from 'react-router-dom'
// 本地缓存了菜单列表
const menus = {
    undefined: [
        {
            title: '首页',
            key: '/home',
            // children: [{
            //     title: '子页',
            //     key: '/home/child',

            // }]
        },
    ],
    1: [
        {
            title: '首页',
            key: '/home',
        },
        {
            title: '用户管理',
            key: '/manager/users',
        },
        {
            title: '订单管理',
            key: '/manager/orders',
        },
        {
            title: '广告管理',
            key: '/manager/ads',
        },
        {
            title: '权限管理',
            key: '/manager/permission',
        },
        {
            title: '我的信息',
            key: '/user/info'
        },
    ],
    2: [
        {
            title: '首页',
            key: '/home'
        },
        {
            title: '广告',
            key: '/ads/index',
        },
        {
            title: '发布广告',
            key: '/business/publish',
        },
        {
            title: '我的信息',
            key: '/user/info'
        },
        {
            title: '我的广告',
            key: '/user/ads',
        },
        {
            title: '我的订单',
            key: '/user/orders',
            
        },
    ],
    0: [
        {
            title: '首页',
            key: '/home'
        },
        {
            title: '广告',
            key: '/ads/index',
        },
        {
            title: '游戏',
            key: '/games',
        },
        {
            title: '我的信息',
            key: '/user/info'
        },
        {
            title: '我的订单',
            key: '/user/orders',
            
        },
    ],
}
// 菜单列表对应的权限路由规则
const routeMap = {
    '/home': <Route key="/home" path="/home" component={Home} />,
    '/ads/index': <Route key="/ads/:page" path="/ads/:page" component={adTable} />,
    '/manager/users': <Route key="/manager/users" path="/manager/users" component={UserTable} />,
    '/manager/orders': <Route key="/manager/orders" path="/manager/orders" component={OrderTable} />,
    '/manager/ads': <Route key="/manager/ads" path="/manager/ads" component={AdTable} />,
    '/manager/permission': <Route key="/manager/permission" path="/manager/permission" component={PermissionTable} />,
    '/business/publish': <Route key="/business/publish" path="/business/publish" component={Publish} />,
    '/user/info': <Route key="/user/info" path="/user/info" component={MyInfo} />,
    '/user/orders': <Route key="/user/orders" path="/user/orders" component={MyOrders} />,
    '/user/ads': <Route key="/user/ads" path="/user/ads" component={MyAds} />,
}

export const getMenus = (userType) => menus[userType]
export const getRoutes = (userType) => getMenus(userType).map(item => item.key).map(item => routeMap[item])