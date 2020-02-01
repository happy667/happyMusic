import Vue from 'vue'
import store from '@/store/index.js'
import songApi from '@/api/song.js'
const utils = {
  async playMusic(song, list = null, index) {
    // 检查音乐是否可用
    songApi.checkMusic(song.id).then(res => {
      if (res.data.success) {
        if (list === null) { // 传入列表为空
          let list = store.state.playList
          const listIndex = list.findIndex(item => item.id === song.id)
          if (listIndex === -1) { // 如果不存在该歌曲就添加到歌曲列表中
            list.unshift(song)
            store.dispatch('setSelectPlay', {
              list,
              index: 0
            })
          } else {
            // 播放索引为index的歌曲
            store.commit('setCurrentPlayIndex', listIndex)
          }
        } else {
          store.dispatch('setSelectPlay', {
            list,
            index
          })
        }
      }
    }).catch((res) => {
      // 提示
      Vue.prototype.$toast(res.data.message)
    })
  },
  // 限制向前向后移动索引
  limitMoveIndex(index1, index2, length) {
    if (index1 > index2) { // 说明是下一首播放
      // 如果当前索引超过播放列表长度就赋值为0
      index1 = utils.limitAddIndex(index1, length)
    } else { // 说明是上一首
      // 如果当前索引小于0就播放最后一首
      index1 = utils.limitCutIndex(index1, length - 1)
    }
    return index1
  },
  // 限制索引加1
  limitAddIndex(index, length) {
    index = ++index
    if (index >= length) { // 如果当前索引超过播放列表长度就赋值为0
      index = 0
    }
    return index
  },
  // 限制索引减1
  limitCutIndex(index, length) {
    index = --index
    if (index < 0) { // 如果当前索引超过播放列表长度就赋值为0
      index = length
    }
    return index
  }
}
Vue.prototype.utils = utils
