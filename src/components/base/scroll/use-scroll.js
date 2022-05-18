import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

BScroll.use(ObserveDOM)

// options就是传过来的props emit是传过来的事件
export default function useScroll(wrapperRef, options, emit) {
  const scroll = ref(null)

  // observeDOM: true, 开启对content以及content子元素DOM改变的侦测，当这些DOM元素发生变化是，将
  // 会触发scroll的refresh方法。observeDOM有一下两个特征：
  // 针对改变频繁的css属性，增加debounce;如果改变发生在scroll动画中，则不会发生refresh
  onMounted(() => {
    const scrollVal = scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })

    // probeType>0 监听scroll事件
    if (options.probeType > 0) {
      scrollVal.on('scroll', (pos) => {
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })
  // 使用keepAlive之后
  onDeactivated(() => {
    scroll.value.disable()
  })

  return scroll
}
