/**
 * 添加拦截器
 *   拦截 request请求
 *   拦截 uploadFile文件上传
 * TODO:
 *     1.拼接基础地址
 *     2.请求超时
 *     3.添加小程序端请求头标识
 *     4.添加token请求头标识
 *
 */
import { useMemberStore } from '@/stores'
// 请求基地址
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1.非http开头的请求，拼接baseURL
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 2.请求超时 默认60s
    options.timeout = 10000
    // 3.添加小程序端请求头标识
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    // 4.添加token请求头标识
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
    console.log('options', options)
  },
}

// 拦截request请求
uni.addInterceptor('request', httpInterceptor)
// 拦截uploadFile文件上传
uni.addInterceptor('uploadFile', httpInterceptor)

/***
 * 请求函数
 * @param UniApp.RequestOptions
 * @returns Promise
 *  1.返回Promise对象,用于处理返回值类型
 *  2.获取数据成功
 *   2.1 提取核心数据 res.data
 *   2.2 添加类型，支持泛型
 *  3.获取数据失败
 *   3.1 401错误  -> 清理用户信息，跳转到登录页
 *   3.2 其他错误 -> 根据后端错误信息轻提示
 *   3.3 网络错误 -> 提示用户换网络
 */
type Data<T> = {
  code: string
  msg: string
  result: T
}
// 2.2 添加类型，支持泛型
export const http = <T>(options: UniApp.RequestOptions) => {
  //1. 返回Promise对象
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 2.请求成功
      success: (res) => {
        // 状态2xx，参考axios的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 2.1 提取核心数据 res.data
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          //401错误 -> 清理用户信息，跳转到登录页
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求错误',
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}
