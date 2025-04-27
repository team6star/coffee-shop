import type { CartItem } from '@/types/cart'
import { http } from '@/utils/http'
/**
 * 加入购物车
 * @params data - 商品信息 请求体参数
 * */
export const postMemberCartAPI = (data: { skuId: string; count: number }) => {
  return http<CartItem>({
    method: 'POST',
    url: '/member/cart',
    data,
  })
}
/* 
获取购物车列表
*/
export const getMemberCartAPI = () => {
  return http<CartItem[]>({
    method: 'GET',
    url: '/member/cart',
  })
}
