import type { CategoryTopItem } from '@/types/category'
import { http } from '@/utils/http'

/**
 * 请求封装
 * 分类列表-小程序
 * @returns
 */
export const getCategoryTopAPI = () => {
  return http<CategoryTopItem[]>({
    method: 'GET',
    url: '/category/top',
  })
}
