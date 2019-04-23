const menuList = [
    {
        title: '首页',
        key: '/admin/home'
    },
    {
        title: '管理',
        key: '/admin/manager',
        children: [
            {
                title: '用户管理',
                key: '/admin/manager/users',
            },
            {
                title: '订单管理',
                key: '/admin/manager/orders',
            },
            {
                title: '广告管理',
                key: '/admin/manager/ads',
            },

        ]
    },
    {
        title: '广告区',
        key: '/admin/ads',
    },
    {
        title: '统计',
        key: '/admin/charts',
    },
];
export default menuList;
