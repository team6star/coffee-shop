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
const httpInterceptor={
  // 拦截前触发
  invoke(options:UniApp.RequestOptions){
    // 1.非http开头的请求，拼接baseURL
    if(!options.url.startsWith('http')){
      options.url=baseURL+options.url
    }
    // 2.请求超时 默认60s
    options.timeout=10000
    // 3.添加小程序端请求头标识
    options.header={
      ...options.header,
      'source-client':'miniapp',
    }
    // 4.添加token请求头标识
    const memberStore=useMemberStore()
    const token=memberStore.profile?.token
    if(token){
      options.header.Authorization=token
    }
    console.log('options',options)
  }
}

// 拦截request请求
uni.addInterceptor('request',httpInterceptor)
// 拦截uploadFile文件上传
uni.addInterceptor('uploadFile',httpInterceptor)