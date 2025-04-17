<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { getHomeBannerAPI, getHomeCategoryAPI } from '@/services/home'
import { ref } from 'vue'
import CustomNavbar from './components/CustomNavbar.vue'

import CategoryPanel from './components/CategoryPanel.vue'
import type { BannerItem, CategoryItem } from '@/types/home'
// 指定类型
const bannerList = ref<BannerItem[]>([])
const categoryList = ref<CategoryItem[]>([])
// 获取轮播图数据
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}
// 后去首页分类数据
const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}
//初始化调用API
onLoad(() => {
  getHomeBannerData()
  getHomeCategoryData()
})
</script>

<template>
  <CustomNavbar />
  <!-- 传值给子组件 -->
  <XtxSwiper :list="bannerList" />
  <CategoryPanel :list="categoryList" />
  <view class="index">index</view>
</template>

<style lang="scss">
//
page {
  background-color: #f7f7f7;
}
</style>
