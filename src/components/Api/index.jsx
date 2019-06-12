import React from 'react'
import Login from "../../pages/form/login"
import UserTable from "../../pages/manager/userTable"
import CoinTable from "../../pages/manager/coinTable"
import ApprovalTable from "../../pages/manager/approvalTable"
import AdTable from "../../pages/manager/adTable"
import OrderTable from "../../pages/manager/orderTable"
import PermissionTable from "../../pages/manager/permissionTable"
import InvitationTable from "../../pages/manager/invitationTable"
import MyInfo from "../../pages/user/myInfo"
import Exchange from "../../pages/exchange"
import MyAds from "../../pages/user/myAds"
import MyOrders from "../../pages/user/myOrders"
import Ads from "../../pages/ad"
import Logout from "../../pages/logout"
import Publish from "../../pages/form/publish"
import { Route } from 'react-router-dom'
// 本地缓存了菜单列表
const menus = {
    // undefined: [
    //     {
    //         title: '首页',
    //         key: '/home',
    //         // children: [{
    //         //     title: '子页',
    //         //     key: '/home/child',

    //         // }]
    //     },
    //     {
    //         title: '行情',
    //         key: '/trend',
    //     },
    // ],
    undefined: [
        {
            title: '首页',
            position: 'left',
            key: '/home'
        },
        {
            title: '行情',
            position: 'left',
            key: '/trend',
        },
        {
            title: '广告',
            position: 'left',
            key: '/ads/index',
        },
        {
            title: '游戏',
            position: 'left',
            key: '/games',
        },
        {
            title: '兑换海贝',
            position: 'left',
            key: '/exchange',
        },
        {
            title: '登录',
            position: 'right',
            key: '/login',
        },
        {
            title: '注册',
            position: 'right',
            key: '/register',
        },

    ],
    3: [
        {
            title: '首页',
            position: 'left',
            key: '/home',
        },
        {
            title: '行情',
            position: 'left',
            key: '/trend',
        },
        {
            title: '用户管理',
            position: 'left',
            key: '/manager/users',
        },
        {
            title: 'COIN管理',
            position: 'left',
            key: '/manager/coins',
        },
        {
            title: '邀请码管理',
            position: 'left',
            key: '/manager/invitation',
        },
        {
            title: '审核管理',
            position: 'left',
            key: '/manager/approval',
        },
        {
            title: '订单管理',
            position: 'left',
            key: '/manager/orders',
        },
        {
            title: '广告管理',
            position: 'left',
            key: '/manager/ads',
        },
        {
            title: '权限管理',
            position: 'left',
            key: '/manager/permission',
        },
        {
            title: '我的信息',
            position: 'left',
            key: '/user/info'
        },
        {
            title: '安全退出',
            position: 'right',
            key: '/logout',
        },
    ],
    2: [
        {
            title: '首页',
            position: 'left',
            key: '/home'
        },
        {
            title: '行情',
            position: 'left',
            key: '/trend',
        },
        {
            title: '广告',
            position: 'left',
            key: '/ads/index',
        },
        {
            title: '游戏',
            position: 'left',
            key: '/games',
        },
        {
            title: '发布广告',
            position: 'left',
            key: '/business/publish',
        },
        {
            title: '我的信息',
            position: 'left',
            key: '/user/info'
        },
        {
            title: '我的广告',
            position: 'left',
            key: '/user/ads',
        },
        {
            title: '我的订单',
            position: 'left',
            key: '/user/orders',

        },
        {
            title: '兑换海贝',
            position: 'left',
            key: '/exchange',
        },
        {
            title: '安全退出',
            position: 'right',
            key: '/logout',
        },
    ],
    1: [
        {
            title: '首页',
            position: 'left',
            key: '/home'
        },
        {
            title: '行情',
            key: '/trend',
            position: 'left',
        },
        {
            title: '广告',
            position: 'left',
            key: '/ads/index',
        },
        {
            title: '游戏',
            position: 'left',
            key: '/games',
        },
        {
            title: '我的信息',
            position: 'left',
            key: '/user/info'
        },
        {
            title: '我的订单',
            position: 'left',
            key: '/user/orders',

        },
        {
            title: '兑换海贝',
            position: 'left',
            key: '/exchange',
        },
        {
            title: '安全退出',
            position: 'right',
            key: '/logout',
        },
    ],
}
// 菜单列表对应的权限路由规则
const routeMap = {
    '/ads/index': <Route key="/ads/:page" path="/ads/:page" component={Ads} />,
    '/manager/users': <Route key="/manager/users" path="/manager/users" component={UserTable} />,
    '/exchange': <Route key="/exchange" path="/exchange" component={Exchange} />,
    '/manager/coins': <Route key="/manager/coins" path="/manager/coins" component={CoinTable} />,
    '/manager/orders': <Route key="/manager/orders" path="/manager/orders" component={OrderTable} />,
    '/manager/ads': <Route key="/manager/ads" path="/manager/ads" component={AdTable} />,
    '/manager/permission': <Route key="/manager/permission" path="/manager/permission" component={PermissionTable} />,
    '/manager/approval': <Route key="/manager/approval" path="/manager/approval" component={ApprovalTable} />,
    '/manager/invitation': <Route key="/manager/invitation" path="/manager/invitation" component={InvitationTable} />,
    '/business/publish': <Route key="/business/publish" path="/business/publish" component={Publish} />,
    '/user/info': <Route key="/user/info" path="/user/info" component={MyInfo} />,
    '/user/orders': <Route key="/user/orders" path="/user/orders" component={MyOrders} />,
    '/user/ads': <Route key="/user/ads" path="/user/ads" component={MyAds} />,
    '/logout': <Route key="/logout" path="/logout" component={Logout} />,

}

export const getMenus = (userType) => menus[userType]
export const getRoleRoutes = (userType) =>
    userType ? getMenus(userType).map(item => item.key).map(item => routeMap[item])
        :
        <Route component={Login} />