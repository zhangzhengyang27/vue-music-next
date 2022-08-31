<template>
  <div ref="rootRef" class="suggest" v-loading:[loadingText]="loading" v-no-result:[noResultText]="noResult">
    <ul class="suggest-list">
      <!-- 歌手名     -->
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <!-- 歌曲     -->
      <li class="suggest-item" v-for="song in songs" :key="song.id" @click="selectSong(song)">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">
            {{ song.singer }}-{{ song.name }}
          </p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed, nextTick } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
// 处理上拉加载的
import usePullUpLoad from './use-pull-up-load'

export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song', 'select-singer'],
  setup(props, { emit }) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const noResultText = ref('抱歉，暂无搜索结果')
    const manualLoading = ref(false)

    const loading = computed(() => {
      return !singer.value && !songs.value.length
    })

    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })

    // 下拉加载的动画
    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })

    // 当loading和manualLoading都存在的时候，禁止上拉
    const preventPullUpLoad = computed(() => {
      return loading.value || manualLoading.value
    })

    const { isPullUpLoad, rootRef, scroll } = usePullUpLoad(searchMore, preventPullUpLoad)

    // props.query 不是一个响应式变量，需要特殊处理
    watch(() => props.query, async (newQuery) => {
      if (!newQuery) {
        return
      }
      await searchFirst()
    })

    async function searchFirst() {
      if (!props.query) {
        return
      }
      // 清除上一次搜索的结果
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true

      const result = await search(props.query, page.value, props.showSinger)
      // 去获取歌曲的 url
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }

    async function searchMore() {
      // hasmore 为 fasle 或者 query为空
      if (!hasMore.value || !props.query) {
        return
      }
      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }

    // 请求的数据不足滚动的时候，再次去请求数据
    async function makeItScrollable() {
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }

    // 发送自定义事件
    function selectSong(song) {
      emit('select-song', song)
    }

    function selectSinger(singer) {
      emit('select-singer', singer)
    }

    return {
      singer,
      songs,
      loadingText,
      noResultText,
      loading,
      noResult,
      pullUpLoading,
      selectSong,
      selectSinger,
      // pullUpLoad
      rootRef
    }
  }
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;

      .icon {
        flex: 0 0 30px;
        width: 30px;

        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }

      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;

        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
