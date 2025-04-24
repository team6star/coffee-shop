<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import {
  getHomeBannerAPI,
  getHomeCategoryAPI,
  getHomeGoodsGuessLikeAPI,
  getHomeHotAPI,
} from '@/services/home'
import { ref } from 'vue'
import CustomNavbar from './components/CustomNavbar.vue'

import CategoryPanel from './components/CategoryPanel.vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import type { XtxGuessInstance } from '@/types/component'
import HotPanel from './components/HotPanel.vue'
import PageSkeleton from './components/PageSkeleton.vue'
import { useGuessList } from '@/composables'
// 指定类型
const bannerList = ref<BannerItem[]>([])
const categoryList = ref<CategoryItem[]>([])
// 获取轮播图数据
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}
// 获取首页分类数据
const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}
// 获取热门推荐数据
const HotList = ref<HotItem[]>([])
const getHomeHotData = async () => {
  const res = await getHomeHotAPI()
  HotList.value = res.result
}
// 猜你喜欢分页加载
const { guessRef, onScrolltolower } = useGuessList()
// 下拉刷新状态
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开启动画
  isTriggered.value = true
  // 重置数据 父调子
  guessRef.value?.resetData()
  //加载数据
  await Promise.all([
    getHomeBannerData(),
    getHomeCategoryData(),
    getHomeHotData(),
    // 猜你喜欢组件数据加载
    guessRef.value?.getMore(),
  ])
  // 关闭动画
  isTriggered.value = false
}
const isLoading = ref(false)
//初始化调用API 页面加载
onLoad(async () => {
  isLoading.value = true
  await Promise.all([
    getHomeBannerData(),
    getHomeCategoryData(),
    getHomeHotData(),
  ])
  isLoading.value = false
})
</script>

<template>
  <CustomNavbar />
  <!-- 传值给子组件 -->
  <scroll-view
    refresher-enabled
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="onScrolltolower"
    :refresher-triggered="isTriggered"
    scroll-y
    class="scroll-view"
  >
    <PageSkeleton v-if="isLoading" />
    <template v-else>
      <XtxSwiper :list="bannerList" />
      <CategoryPanel :list="categoryList" />
      <HotPanel :list="HotList" />
      <XtxGuess ref="guessRef" />
    </template>
  </scroll-view>
</template>

<style lang="scss">
//
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.scroll-view {
  flex: 1;
}
</style>
