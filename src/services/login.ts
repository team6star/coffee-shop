import type { LoginResult } from '@/types/member'
import { http } from '@/utils/http'
/**
 * 小程序登录
 * @param data 请求参数
 */
export type LoginParams = {
  code: string
  encryptedData: string
  iv: string
}
export const postLoginWxMin = (data: LoginParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin',
    data,
  })
}
/**
 * 小程序登录_内测版(模拟快捷登录)
 * @param phoneNumber 模拟手机号
 */
export const postLoginWxMinSimpleAPI = (phoneNumber: string) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin/simple',
    data: { phoneNumber },
  })
}
