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
import HotPanel from './components/HotPanel.vue'
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

//初始化调用API
onLoad(() => {
  getHomeBannerData()
  getHomeCategoryData()
  getHomeHotData()
})
</script>

<template>
  <CustomNavbar />
  <!-- 传值给子组件 -->
  <scroll-view scroll-y class="scroll-view">
    <XtxSwiper :list="bannerList" />
    <CategoryPanel :list="categoryList" />
    <HotPanel :list="HotList" />
    <XtxGuess />
  </scroll-view>

  <view class="index">index</view>
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
