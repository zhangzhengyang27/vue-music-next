import { ref, watch, computed, nextTick } from 'vue'

// 处理标题固定的方法
export default function useFixed(props) {
  const TITLE_HEIGHT = 30
  const groupRef = ref(null)
  // 每个区间的高度数组
  const listHeights = ref([])
  // 记录滚动值
  const scrollY = ref(0)
  // 当前落在区域的索引
  const currentIndex = ref(0)
  const distance = ref(0)

  // 计算属性生成fixedTitle
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  // 计算标题的样式，标题需要设置偏移量
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    // 这里的 diff 是一个负值
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0,${diff}px,0)`
    }
  })

  // 数据传递过来，但是dom不一定发生变化，需要等一个nextTick()
  watch(() => props.data, async () => {
    await nextTick()
    calculate()
  })

  // 监听scrollY的值，确定滚动的区间
  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        // 滚动时，处理动画的效果
        distance.value = heightBottom - newY
      }
    }
  })

  // 数据变化的时候去计算
  function calculate() {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    // 第一个组的高度为0
    let height = 0
    // 清空数组
    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      // 高度需要累加的
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }

  // 实时滚动的值 pos 是scroll事件传递过来的
  function onScroll(pos) {
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}
