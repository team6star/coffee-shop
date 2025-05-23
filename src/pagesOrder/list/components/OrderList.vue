<script setup lang="ts">
import {
  deleteMemberOrderAPI,
  getMemberOrderAPI,
  putMemberOrderReceiptByIdAPI,
} from '@/services/order'
import type { OrderItem, OrderListParams } from '@/types/order'
import { orderStateList, OrderState } from '@/services/constants'
import { onMounted, ref } from 'vue'
import { getPayMockAPI, getPayWxPayMiniPayAPI } from '@/services/pay'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 定义props
const props = defineProps<{
  // 订单状态
  orderState: number
}>()

// 请求参数
const queryParams: Required<OrderListParams> = {
  page: 1,
  pageSize: 5,
  orderState: props.orderState,
}

// 获取订单列表
const orderList = ref<OrderItem[]>([])
// 是否加载中标记，用于防止滚动触底触发多次请求
const isLoading = ref(false)
const getMemberOrderData = async () => {
  // 如果数据处于加载中，退出函数
  if (isLoading.value) return
  // 退出分页判断
  if (isFinish.value === true) {
    return uni.showToast({
      title: '没有更多数据了',
      icon: 'none',
    })
  }
  // 发送请求前，标记为加载中
  isLoading.value = true
  // 发送请求
  const res = await getMemberOrderAPI(queryParams)
  // console.log(res)

  // 发送请求后，重置标记
  isLoading.value = false
  // 数组追加
  orderList.value.push(...res.result.items)
  // 分页条件 当前页码是否小于总页数
  if (queryParams.page < res.result.pages) {
    // 页码累加
    queryParams.page++
  } else {
    // 标记为已结束
    isFinish.value = true
  }
}

onMounted(() => {
  getMemberOrderData()
})

// 订单支付
const onOrderPay = async (id: string) => {
  if (import.meta.env.DEV) {
    // 开发环境模拟支付
    await getPayMockAPI({ orderId: id })
  } else {
    // #ifdef MP-WEIXIN
    // 正式环境微信支付
    const res = await getPayWxPayMiniPayAPI({ orderId: id })
    wx.requestPayment(res.result)
    // #endif
  }
  // 成功提示
  uni.showToast({ title: '支付成功' })
  // 更新订单状态
  const order = orderList.value.find((item) => item.id === id)
  order!.orderState = OrderState.DaiFaHuo
}

// 确认收货
const onOrderConfirm = (id: string) => {
  // 二次确认弹窗
  uni.showModal({
    content: '为保障您的权益，请收到货并确认无误后，再确认收货',
    success: async (success) => {
      if (success.confirm) {
        await putMemberOrderReceiptByIdAPI(id)
        // 成功提示
        uni.showToast({ title: '确认收货成功', icon: 'success' })
        // 确认成功 更新为待评价
        const order = orderList.value.find((item) => item.id === id)
        order!.orderState = OrderState.DaiPingJia
      }
    },
  })
}

// 删除订单
const onOrderDelete = (id: string) => {
  // 二次确认弹窗
  uni.showModal({
    content: '确定删除该订单吗？',
    success: async (success) => {
      if (success.confirm) {
        // 删除订单
        await deleteMemberOrderAPI({ ids: [id] })
        // 删除成功 提示
        uni.showToast({ title: '删除成功', icon: 'success' })
        // 删除成功 刷新列表
        // getMemberOrderData()
        // 删除成功 从列表中删除
        // orderList.value = orderList.value.filter((item) => item.id !== id)
        const index = orderList.value.findIndex((v) => v.id === id)
        orderList.value.splice(index, 1)
      }
    },
  })
}
// 是否分页结束
const isFinish = ref(false)
// 是否触发下拉刷新
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开启动画
  isTriggered.value = true
  // 重置数据 父调子
  queryParams.page = 1
  orderList.value = []
  isFinish.value = false
  //加载数据
  await getMemberOrderData()
  // 关闭动画
  isTriggered.value = false
}
</script>
<template>
  <scroll-view
    scroll-y
    class="orders"
    refresher-enabled
    :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="getMemberOrderData"
  >
    <view class="card" v-for="order in orderList" :key="order.id">
      <!-- 订单信息 -->
      <view class="status">
        <text class="date">{{ order.createTime }}</text>
        <!-- 订单状态文字 -->
        <text>{{ orderStateList[order.orderState].text }}</text>
        <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
        <text
          v-if="order.orderState >= OrderState.DaiPingJia"
          class="icon-delete"
          @tap="onOrderDelete(order.id)"
        ></text>
      </view>
      <!-- 商品信息，点击商品跳转到订单详情，不是商品详情 -->
      <navigator
        v-for="sku in order.skus"
        :key="sku.id"
        class="goods"
        :url="`/pagesOrder/detail/detail?id=${order.id}`"
        hover-class="none"
      >
        <view class="cover">
          <image mode="aspectFit" :src="sku.image"></image>
        </view>
        <view class="meta">
          <view class="name ellipsis">{{ sku.name }}</view>
          <view class="type">{{ sku.attrsText }}</view>
        </view>
      </navigator>
      <!-- 支付信息 -->
      <view class="payment">
        <text class="quantity">共{{ order.totalNum }}件商品</text>
        <text>实付</text>
        <text class="amount">
          <text class="symbol">¥</text>{{ order.payMoney }}</text
        >
      </view>
      <!-- 订单操作按钮 -->
      <view class="action">
        <!-- 待付款状态：显示去支付按钮 -->
        <template v-if="order.orderState === OrderState.DaiFuKuan">
          <view @tap="onOrderPay(order.id)" class="button primary">去支付</view>
        </template>
        <template v-else>
          <navigator
            class="button secondary"
            :url="`/pagesOrder/create/create?orderId=${order.id}`"
            hover-class="none"
          >
            再次购买
          </navigator>
          <!-- 待收货状态: 展示确认收货 -->
          <view
            v-if="order.orderState === OrderState.DaiShouHuo"
            class="button primary"
            @tap="onOrderConfirm(order.id)"
            >确认收货</view
          >
        </template>
      </view>
    </view>
    <!-- 底部提示文字 -->
    <view
      class="loading-text"
      :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }"
    >
      {{ isFinish ? '没有更多数据~' : '正在加载...' }}
    </view>
  </scroll-view>
</template>
<style lang="scss">
//  订单列表
.orders {
  .card {
    min-height: 100rpx;
    padding: 20rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #fff;

    &:last-child {
      padding-bottom: 40rpx;
    }
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #999;
    margin-bottom: 15rpx;

    .date {
      color: #666;
      flex: 1;
    }

    .primary {
      color: #ff9240;
    }

    .icon-delete {
      line-height: 1;
      margin-left: 10rpx;
      padding-left: 10rpx;
      border-left: 1rpx solid #e3e3e3;
    }
  }

  .goods {
    display: flex;
    margin-bottom: 20rpx;

    .cover {
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;
      position: relative;
    }

    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      line-height: 1;
      padding: 6rpx 4rpx 6rpx 8rpx;
      font-size: 24rpx;
      color: #fff;
      border-radius: 10rpx 0 0 0;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 10rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .more {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #333;
    }
  }

  .payment {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    line-height: 1;
    padding: 20rpx 0;
    text-align: right;
    color: #999;
    font-size: 28rpx;
    border-bottom: 1rpx solid #eee;

    .quantity {
      font-size: 24rpx;
      margin-right: 16rpx;
    }

    .amount {
      color: #444;
      margin-left: 6rpx;
    }

    .symbol {
      font-size: 20rpx;
    }
  }

  .action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 20rpx;

    .button {
      width: 180rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20rpx;
      border-radius: 60rpx;
      border: 1rpx solid #ccc;
      font-size: 26rpx;
      color: #444;
    }

    .secondary {
      color: #27ba9b;
      border-color: #27ba9b;
    }

    .primary {
      color: #fff;
      background-color: #27ba9b;
    }
  }

  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
</style>
