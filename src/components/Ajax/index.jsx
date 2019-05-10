import axios from 'axios'
import { message } from 'antd';
export default class Ajax {
	static ajax = (
		method,
		url,
		data,
		baseURL,
		timeout = 5000,
	) => new Promise(
		(resolve, reject) => {
			// Promise是一个包裹者异步操作的对象，它有三个状态:未完成， 已完成， 已失败
			// 构造函数接受一个函数作为参数
			// 该函数的两个参数分别是resolve和reject,它们是两个函数，由 JavaScript 引擎提供，不用自己部署。
			// resolve函数执行会使promise对象变成已完成状态
			// reject函数执行会使promise对象变成已失败状态
			axios(
				// axiso 也是一个promise
				method === 'get' ?
					{
						method,
						url,
						params: data,
						baseURL,
						timeout,
					} : {
						method,
						url,
						data,
						baseURL,
						timeout,
					}
			).then(
				// then方法返回的是新的Promise实例
				// 如果一个 Promise 对象状态变为resolved，则会调用then方法指定的第一个回调函数
				// 第一个参数是上一个promise对象的resolved状态的回调函数
				// 第二个参数（可选）是rejected状态的回调函数。
				(response) => {
					// response 是http请求的响应 response.data 可以拿到业务层的数据
					// http状态码
					if (response.status === 200) {
						let res = response.data
						//设定业务反馈代码 200 为 正常
						if (res.status === 200 || true) { //TODO 这里先不过滤
							// 调用resolve或reject并不会终结 Promise 的参数函数的执行
							// 参数会被传递给回调函数, 这个参数可以是另一个promise对象
							// Promise 的状态一旦改变，就永久保持该状态,无法被再次改变
							return resolve(res)
							// console.log('如果没有return 这行会被执行')
						} else {
							return message.info(res.message)
						}
					}
					// else {
					// 如果没有使用catch方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层，在外层不会退出进程、终止脚本执行
					// 不推荐使用reject捕获异常， 建议使用catch 
					// return reject(response.data)
					// }
				}
				// Promise 对象的错误具有“冒泡”性质，会一直向后传递，错误总是会被下一个catch语句捕获。
				// Promise对象的异步操作抛出错误，状态会变为rejected，会调用catch指定的回调函数处理异常
				// then方法指定的回调函数，如果运行中抛出错误，也会被catch方法捕获。
				// catch方法返回的还是一个 Promise 对象，后面可以接着调用then方法
			).catch(error => console.log('axios catch in', JSON.stringify(error)))
		}
	)
}
