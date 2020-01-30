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
            // 全屏播放
            store.commit('setPlayerFullScreen', true)
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
  }
}
Vue.prototype.utils = utils
