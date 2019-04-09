import axios from 'axios'
import { notification, Modal, message } from 'antd';
export default class Ajax {
    static ajax = (
        method,
        url,
        data = '',
        baseURL,
        timeout = 5000, ) => (
            new Promise(
                (resolve, reject) => {
                    axios({
                        method,
                        url,
                        data,
                        baseURL,
                        timeout,
                    }).then(response => {
                        // HTTP状态码返回200说明HTTP协议层面被正常处理
                        if (response.status === 200) {
                            // response 是http请求的响应返回
                            // res 是业务层面的数据
                            let res = response.data
                            // 业务状态码返回0说明业务层面请求被正常处理
                            if (res.code === 0) {
                                // message.success(res.successMsg);
                                resolve(res)
                            } else {
                                notification.error({
                                    message: res.errMsg,
                                })
                            }
                        } else {
                            notification.error({
                                message: response.status,
                            })
                            reject(response.data)
                        }
                    }
                    ).catch(() => {
                        Modal.error({
                            title: "请求发送失败",
                            content: "网络状态异常",
                        })
                    })
                }
            )
        )
}