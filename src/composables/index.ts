import type { XtxGuessInstance } from '@/types/component'
import { ref } from 'vue'

// 猜你喜欢组合式函数
export const useGuessList = () => {
  // 获取猜你喜欢组件实例
  const guessRef = ref<XtxGuessInstance>()
  // 滚动触底获取分页数据
  const onScrolltolower = () => {
    // 父调子
    guessRef.value?.getMore()
  }
  // 返回封装的ref和函数
  return {
    guessRef,
    onScrolltolower,
  }
}
