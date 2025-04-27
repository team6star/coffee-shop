import { http } from '@/utils/http'
/**
 * 加入购物车
 * @params data - 商品信息 请求体参数
 * */
export const postMemberCartAPI = (data: { skuId: string; count: number }) => {
  return http({
    method: 'POST',
    url: '/member/cart',
    data,
  })
}
