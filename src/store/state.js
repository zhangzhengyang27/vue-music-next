import { PLAY_MODE, SEARCH_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

const state = {
  // 顺序播放列表
  sequenceList: [],
  // 真实的播放列表
  playlist: [],
  playing: false,
  // 播放模式
  playMode: PLAY_MODE.sequence,
  // 播放索引
  currentIndex: 0,
  fullScreen: false,
  // 喜欢列表
  favoriteList: [],
  searchHistory: load(SEARCH_KEY),
  playHistory: []
}

export default state
