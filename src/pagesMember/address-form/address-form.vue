<script setup lang="ts">
import {
  getMemberAddressDetailAPI,
  postMemberAddressAPI,
  putMemberAddressAPI,
} from '@/services/address'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// 表单数据
const form = ref({
  receiver: '', // 收货人
  contact: '', // 联系方式
  fullLocation: '', // 省市区(前端展示)
  provinceCode: '', // 省份编码(后端参数)
  cityCode: '', // 城市编码(后端参数)
  countyCode: '', // 区/县编码(后端参数)
  address: '', // 详细地址
  isDefault: 0, // 默认地址，1为是，0为否
})

// 获取页面参数
const query = defineProps<{
  id?: String
}>()
// console.log(query)

// 动态设置标题
uni.setNavigationBarTitle({
  title: query.id ? '修改地址' : '新建地址',
})
// 收集所在地区
const onRegionChange: UniHelper.RegionPickerOnChange = (ev) => {
  // console.log(ev.detail.value)
  // 省市区前端展示
  form.value.fullLocation = ev.detail.value.join(' ')
  // 省市区后端参数
  const [provinceCode, cityCode, countyCode] = ev.detail.code!
  // 合并数据
  Object.assign(form.value, {
    provinceCode,
    cityCode,
    countyCode,
  })
}
// 收集是否默认地址
const onSwitchChange: UniHelper.SwitchOnChange = (ev) => {
  form.value.isDefault = ev.detail.value ? 1 : 0
}
// 定义校验规则
const rules = {
  receiver: {
    rules: [{ required: true, errorMessage: '请填写收货人姓名' }],
  },
  contact: {
    rules: [
      { required: true, errorMessage: '请填写联系方式' },
      {
        pattern: /^1[3~9]\d{9}$/,
        errorMessage: '手机号码格式不正确',
      },
    ],
  },
  fullLocation: {
    rules: [{ required: true, errorMessage: '请选择所在地区' }],
  },
  address: {
    rules: [{ required: true, errorMessage: '请填写详细地址' }],
  },
}
// 获取表单实例，用于调用表单方法
const formRef = ref<UniHelper.UniFormsInstance>()
// 提交表单
const onSubmit = async () => {
  try {
    // 表单校验
    await formRef?.value?.validate?.()
    // 校验通过后再发送请求
    if (query.id) {
      // 修改地址请求
      await putMemberAddressAPI(query.id as string, form.value) //有id 修改地址
    } else {
      // 新建地址请求
      await postMemberAddressAPI(form.value) //无id 新建地址
    }
    // 成功提示
    uni.showToast({
      title: query.id ? '修改成功' : '添加成功',
      icon: 'success',
    })
    // 返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'error',
    })
  }
}

// 根据id获取收货地址详情
const getAddressDetailByIdData = async () => {
  if (query.id) {
    // 根据id获取收货地址详情 发送请求
    const res = await getMemberAddressDetailAPI(query.id as string)
    // console.log(res)
    // 合并到表单数据中
    Object.assign(form.value, res.result)
  }
}
onLoad(() => {
  getAddressDetailByIdData()
})
</script>

<template>
  <view class="content">
    <uni-forms :rules="rules" :model="form" ref="formRef">
      <!-- 表单内容 -->
      <uni-forms-item name="receiver" class="form-item">
        <text class="label">收货人</text>
        <input
          class="input"
          placeholder="请填写收货人姓名"
          v-model="form.receiver"
        />
      </uni-forms-item>
      <uni-forms-item name="contact" class="form-item">
        <text class="label">手机号码</text>
        <input
          class="input"
          placeholder="请填写收货人手机号码"
          v-model="form.contact"
        />
      </uni-forms-item>
      <uni-forms-item name="fullLocation" class="form-item">
        <text class="label">所在地区</text>
        <picker
          class="picker"
          mode="region"
          :value="form.fullLocation.split(' ')"
          @change="onRegionChange"
        >
          <view v-if="form.fullLocation">{{ form.fullLocation }}</view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item name="address" class="form-item">
        <text class="label">详细地址</text>
        <input
          class="input"
          placeholder="街道、楼牌号等信息"
          v-model="form.address"
        />
      </uni-forms-item>
      <view class="form-item">
        <label class="label">设为默认地址</label>
        <switch
          class="switch"
          color="#27ba9b"
          :checked="form.isDefault === 1"
          @change="onSwitchChange"
        />
      </view>
    </uni-forms>
  </view>
  <!-- 提交按钮 -->
  <button class="button" @tap="onSubmit">保存并使用</button>
  <!-- {{ form }} -->
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.content {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .form-item,
  .uni-forms-item {
    display: flex;
    align-items: center;
    min-height: 96rpx;
    padding: 25rpx 10rpx 40rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;
    margin-bottom: 0;

    // 调整 uni-forms 样式
    .uni-forms-item__content {
      display: flex;
    }

    .uni-forms-item__error {
      margin-left: 200rpx;
    }

    &:last-child {
      border: none;
    }

    .label {
      width: 200rpx;
      color: #333;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .switch {
      position: absolute;
      right: -20rpx;
      transform: scale(0.8);
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }
}

.button {
  height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
