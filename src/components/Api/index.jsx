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
    ],
    3: [
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
    ],
}

export const getMenus = (userType) => menus[userType]