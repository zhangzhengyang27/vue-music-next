<template>
  <!-- probe-type 可选值1、2、3 决定是否派发scroll事件，对页面的性能有影响。为3时，任何时候都派发scroll事件，包括scrollTo -->
  <scroll class="index-list" :probe-type="3" @scroll="onScroll" ref="scrollRef">
    <ul ref="groupRef">
      <li v-for="group in data" :key="group.title" class="group">
        <h2 class="title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.list" :key="item.id" class="item" @click="onItemClick(item)">
            <img class="avatar" v-lazy="item.pic">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 固定的title -->
    <div class="fixed" v-show="fixedTitle" :style="fixedStyle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <!-- 快速导航 -->
    <!-- 事件委托，阻止冒泡、默认事件 -->
    <div
      class="shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="item"
          :data-index="index"
          class="item"
          :class="{'current':currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
  import Scroll from '@/components/wrap-scroll/index'
  import useFixed from './use-fixed'
  import useShortcut from './use-shortcut'

  export default {
    name: 'index-list',
    components: { Scroll },
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    emits: ['select'],
    setup(props, { emit }) {
      const { groupRef, onScroll, fixedTitle, fixedStyle, currentIndex } = useFixed(props)
      // 快速导航的入口
      const { shortcutList, scrollRef, onShortcutTouchStart, onShortcutTouchMove } = useShortcut(props, groupRef)

      function onItemClick(item) {
        emit('select', item)
      }

      return {
        onItemClick,
        // ---fixed---
        groupRef,
        onScroll,
        fixedTitle,
        fixedStyle,
        currentIndex,
        // ---shortcut---
        shortcutList,
        scrollRef,
        onShortcutTouchStart,
        onShortcutTouchMove
      }
    }
  }
</script>

<style lang="scss" scoped>
  .index-list {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;
    .group {
      padding-bottom: 30px;
      .title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
      .item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
    .fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
    }
    .shortcut {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: $color-background-d;
      font-family: Helvetica;
      .item {
        padding: 3px;
        line-height: 1;
        color: $color-text-l;
        font-size: $font-size-small;
        &.current {
          color: $color-theme
        }
      }
    }
  }
</style>
