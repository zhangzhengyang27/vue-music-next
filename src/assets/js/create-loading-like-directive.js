import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeCls = 'g-relative'

// createLoadingLikeDirective(Loading)
// 挂载到el上，el就是v-loading指令放置的地方
export default function createLoadingLikeDirective(Comp) {
  return {
    mounted(el, binding) {
      // 实际上就是 const app = createApp(Loading)
      const app = createApp(Comp)
      const instance = app.mount(document.createElement('div'))
      // name的存在就是区别不同的组件，不写name的话，会后面的组件会覆盖前面的组件，产生bug
      const name = Comp.name
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance
      // 动态参数title
      const title = binding.arg
      if (typeof title !== 'undefined') {
        // 组件提供了一个setTitle方法
        instance.setTitle(title)
      }

      if (binding.value) {
        append(el)
      }
    },
    // 更新的操作
    updated(el, binding) {
      const title = binding.arg
      const name = Comp.name
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      // 判断添加还是删除样式
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }

  function append(el) {
    const name = Comp.name
    // 获取样式的api
    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    // 将自定义组件挂载到作用的dom上
    el.appendChild(el[name].instance.$el)
  }

  function remove(el) {
    const name = Comp.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }
}
