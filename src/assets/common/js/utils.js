import Vue from 'vue'
import router from '@/router/index.js'
import store from '@/store/index.js'
import songApi from '@/api/song.js'
import {
  getPositionTop
} from '@/assets/common/js/dom.js'
import {
  playMode
} from '@/assets/common/js/config.js'
const utils = {
  async playMusic(song, list = null, index) {
    // 检查音乐是否可用
    songApi.checkMusic(song.id).then(res => {
      if (res.data.success) {
        // 同步播放模式
        let mode = store.state.playMode
        console.log(mode)
        if (mode === playMode.random) { // 随机播放
          let list = utils.randomList(store.state.sequenceList)
          store.commit('setPlayList', list)
        }
        if (list === null) { // 传入列表为空
          let list = store.state.playList
          const listIndex = utils.findIndex(list, song)
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
  },
  // 打乱数据
  randomList(list) {
    let arr = []
    for (let i = 0; i < list.length; i++) {
      arr.push(list[i])
    }
    arr.sort(() => 0.5 - Math.random())
    return arr
  },
  // 复制数据
  copyList(list) {
    let newList = []
    for (let i in list) {
      newList.push(list[i])
    }
    return newList
  },
  // 查找索引
  findIndex(list, song) {
    return list.findIndex(item => {
      return item.id === song.id
    })
  },
  positionSong({
    listNode,
    list,
    song,
    otherHeight = 0
  }) {
    // 获取当前播放列表节点
    // 再找到当前播放歌曲的索引
    let index = utils.findIndex(list, song)
    const element = listNode.childNodes[index]
    // 获取元素的top值
    let top = getPositionTop(element)
    window.scrollTo(0, top - otherHeight) // 减去其他高度
  },
  removeItem(list, item) {
    let newList = list.slice()
    let index = utils.findIndex(list, item)
    list.splice(index, 1)
    newList = list
    return newList
  },
  // 确认提示框
  alertConfirm({
    message,
    confirmButtonText = '确认'
  }) {
    return Vue.prototype.$Dialog.confirm({
      message,
      confirmButtonColor: '#FD4979',
      confirmButtonText,
      width: '265px'
    })
  },
  isLogin() {
    if (store.state.token && store.state.user) {
      return true
    } else {
      return false
    }
  },
  // 弹出跳转登录页面对话框
  alertLogin(redirectPath) {
    utils.alertConfirm({ // 未登录跳转到登录页面
      message: '您还没有登录哦',
      confirmButtonText: '去登陆'
    }).then(() => {
      // 未登录则跳转到登陆界面
      console.dir(router)
      // 设置为前进页面
      store.commit('setIsAdvance', true)
      router.push({
        name: 'login',
        query: {
          redirect: redirectPath
        }
      })
    }).catch(() => {})
  },
  // 防抖
  debounce(fn, delay = 500) {
    // timer是闭包中的
    let timer = null
    return function () {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        fn.apply(this, arguments)
        timer = null
      }, delay)
    }
  },
  // 节流
  throttle(fn, delay = 100) {
    // timer是闭包中的
    let timer = null
    return function () {
      if (timer) {
        return
      }
      timer = setTimeout(() => {
        fn.apply(this, arguments)
        timer = null
      }, delay)
    }
  }
}
export {
  utils
}
Vue.prototype.utils = utils
