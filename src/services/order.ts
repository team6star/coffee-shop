/**
 * 填写订单-获取预付订单
 */
import type { OrderCreateParams, OrderResult } from '@/types/order'
import type { OrderPreResult } from '@/types/order'
import { http } from '@/utils/http'

export const getMemberOrderPreAPI = () => {
  return http<OrderPreResult>({
    method: 'GET',
    url: '/member/order/pre',
  })
}

/**
 * 填写订单-获取立即购买订单
 * @param data 订单信息
 */
export const getMemberOrderPreNowAPI = (data: {
  /** 下单时已经选择好的地址id */
  addressId?: string
  /** 商品数量 */
  count: string
  /** 商品skuid */
  skuId: string
}) => {
  return http<OrderPreResult>({
    method: 'GET',
    url: '/member/order/pre/now',
    data,
  })
}

/**
 * 提交订单
 * @param data 请求信息
 */
export const postMemberOrderAPI = (data: OrderCreateParams) => {
  return http<{ id: string }>({
    method: 'POST',
    url: '/member/order',
    data,
  })
}

/**
 * 获取订单详情
 * @param id 订单id
 */
export const getMemberOrderByIdAPI = (id: string) => {
  return http<OrderResult>({
    method: 'GET',
    url: `/member/order/${id}`,
  })
}
