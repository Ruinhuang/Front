const menuList = [
    {
        title: '首页',
        key: '/home'
    },
    {
        title: '管理',
        key: '/manager',
        children: [
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

        ]
    },
    {
        title: '广告区',
        key: '/ads/index',
    },
    {
        title: '统计',
        key: '/charts',
    },
];
export default menuList;
