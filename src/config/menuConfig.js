// src/config/menuConfig.js
const menuList = [
    {
        title: '首页',
        key: '/home'
    },
    {
        title: '登录',
        key: '/login',
    },
    {
        title: '注册',
        key: '/register',
    },
    {
        title: '表格',
        key: '/table',
        children: [
            {
                title: '基础表格',
                key: '/table/basic',
            },
            {
                title: '高级表格',
                key: '/table/high',
            }
        ]
    },
    {
        title: '订单管理',
        key: '/order',
    },
    {
        title: '用户管理',
        key: '/user'
    },
    {
        title: '图表',
        key: '/charts',
        children: [
            {
                title: '柱形图',
                key: '/charts/bar'
            },
            {
                title: '饼图',
                key: '/charts/pie'
            },
            {
                title: '折线图',
                key: '/charts/line'
            },
        ]
    },
    {
        title: '权限设置',
        key: '/permission'
    },
];
export default menuList;