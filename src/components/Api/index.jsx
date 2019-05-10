import Ajax from '../../components/Ajax'
// 本地缓存了菜单列表
const menus = {
    undefined: [
        {
            title: '首页',
            key: '/home'
        },
    ],
    1: [
        {
            title: '首页',
            key: '/home'
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

export const autoLoginByToken = (token) =>
    new Promise((resolve, reject) => {
        Ajax.ajax(
            'post',
            '/user-login',
            { 'token': token },
            'http://192.168.0.105:8080',
        )
            .then(
                (res) => {
                    this.props.saveLoginData(res.data)
                    sessionStorage.setItem("token", res.data.token);
                    return resolve(res.data)
                }
            ).catch((error) => { 
                console.log("token 自动登录失败", error) })
    }
    )