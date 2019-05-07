import axios from 'axios'
import { message } from 'antd';
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
                    ).then(response => resolve(response.data)
                    // response 是http请求的响应 response.data 可以拿到业务层的数据
                    ).catch(() => message.error("请求发送失败"))
                    })
            )
        )
}
