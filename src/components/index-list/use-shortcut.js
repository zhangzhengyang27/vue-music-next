import { ref, computed } from 'vue'

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)

  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  const touch = {}

  function onShortcutTouchStart(e) {
    // 脱离数字列表的时候没有e.target.dataset.index
    if (e.target.dataset.index) {
      const anchorIndex = parseInt(e.target.dataset.index)
      touch.y1 = e.touches[0].pageY
      // 保留索引 anchorIndex是初识的索引
      touch.anchorIndex = anchorIndex
      scrollTo(anchorIndex)
    }
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    const anchorIndex = touch.anchorIndex + delta

    scrollTo(anchorIndex)
  }

  function scrollTo(index) {
    if (isNaN(index)) {
      return
    }
    // 控制滚动的index
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
