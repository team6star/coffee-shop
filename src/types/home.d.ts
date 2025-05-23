// 数据类型

import type { GoodsItem } from './global'

/**首页-广告区域数据类型 */
export type BannerItem = {
  // id
  id: string
  // 图片地址
  imgUrl: string
  // 跳转链接
  hrefUrl: string
  // 跳转类型
  type: number
}
/**首页-前台类目数据类型 */
export type CategoryItem = {
  // id
  id: string
  // 类目名称
  name: string
  // 图片地址
  icon: string
}
/**首页-热门推荐数据类型 */
export type HotItem = {
  /** 说明 */
  alt: string
  /** id */
  id: string
  /** 图片集合[ 图片路径 ] */
  pictures: string[]
  /** 跳转地址 */
  target: string
  /** 标题 */
  title: string
  /** 推荐类型 */
  type: string
}
/** 猜你喜欢-商品类型 */
export type GuessItem = GoodsItem
