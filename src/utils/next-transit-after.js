/**
 * @file 路由过渡完全后置的钩子函数（在APP.vue中过渡动效钩子@after-leave中执行exceAfter）
 * @file 调用方式：全局this.$nextTransitAfter(()=>{ //执行 })）
 * @author tangyida <530063113@qq.com>
 */
import store from '@/store';

 // 函数缓存列表
const callbacks = [];

// 执行缓存函数
export function exceAfter () {
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

export default function nextTransitAfter (cb) {
  // 如果不处于动画过渡中，则直接执行函数
  if (!store.state.isDuringAnimation) {
    cb.call(this);
    return;
  }
  if (typeof cb !== 'function') return;
  // 缓存函数
  callbacks.push(() => {
    if (cb) {
      try {
          cb.call(this)
      } catch (e) {
          throw e;
      }
    }
  });
}