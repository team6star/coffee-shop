/**
 * declare module '@vue/runtime-core'
 *   现调整为
 * declare module 'vue'
 */
import type XtxSwiper from '@/components/XtxSwiper.vue'
import type XtxGuess from '@/components/XtxGuess.vue'
import 'vue'
declare module 'vue' {
  export interface GlobalComponents {
    //
    XtxSwiper: typeof XtxSwiper
    XtxGuess: typeof XtxGuess
  }
}
// 组件实例类型
export type XtxGuessInstance = InstanceType<typeof XtxGuess>
