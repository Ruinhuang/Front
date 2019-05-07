import axios from 'axios'
import { notification, Modal, message } from 'antd';
export default class Ajax {
    static ajax = (
        method,
        url,
        data,
        baseURL,
        timeout = 5000,
    ) => (
            new Promise(
                (resolve, reject) => {
                    axios(
                        method === 'get' ?
                            {
                                method,
                                url,
                                params: data,
                                baseURL,
                                timeout,
                            }
                            :
                            {
                                method,
                                url,
                                data,
                                baseURL,
                                timeout,
                            }
                    ).then(response => {
                            // response 是http请求的响应 response.data 可以拿到业务层的数据
                            resolve(response.data)
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
