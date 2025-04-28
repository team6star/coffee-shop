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
/**
 * 删除/清空购物车单品
 * @params ids - 删除的购物车商品id列表 ids未skuid集合
 */
export const deleteMemberCartAPI = (data: { ids: string[] }) => {
  return http({
    method: 'DELETE',
    url: '/member/cart',
    data,
  })
}
/**
 * 修改购物车单品
 * @params skuId - SKUID
 * @params count - 商品数量
 * @params selected - 是否选中
 */
export const putMemberCartBySkuIdAPI = (
  skuId: string,
  data: { count?: number; selected?: boolean }
) => {
  return http({
    method: 'PUT',
    url: `/member/cart/${skuId}`,
    data,
  })
}
/**
 * 购物车全选/取消全选
 * @params selected - 是否选中
 */
export const putMemberCartSelectedAPI = (data: { selected: boolean }) => {
  return http({
    method: 'PUT',
    url: '/member/cart/selected',
    data,
  })
}
