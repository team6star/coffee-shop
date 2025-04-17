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
