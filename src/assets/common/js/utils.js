import Vue from 'vue'
import router from '@/router/index.js'
import store from '@/store/index.js'
// import songApi from '@/api/song.js'
import {
  getPositionTop
} from '@/assets/common/js/dom.js'
import {
  PLAY_MODE
} from '@/assets/common/js/config.js'
const utils = {
  playMusic(song, list = null, index) {
    if (song && song.st < 0) {
      Vue.prototype.$toast('亲爱的，暂无版权')
      return
    }
    utils.handlePlayList(song, list, index)
  },
  handlePlayList(song, list = null, index) {
    // 同步播放模式
    let mode = store.state.playMode
    console.log(list)
    if (mode === PLAY_MODE.random) { // 随机播放
      let list = utils.randomList(store.state.sequenceList)
      store.commit('setPlayList', list)
    }
    if (list === null) { // 传入列表为空
      let list = store.state.playList
      console.log(list)
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
      if (song) {
        // 只筛选出可以播放的歌曲
        // 由于筛选列表发生变化所以index需要重置
        list = list.filter(item => item.st >= 0)
        index = list.findIndex(item => item.id === song.id)
      }
      store.dispatch('setSelectPlay', {
        list,
        index
      })
    }
  },
  // 重置播放进度
  resetPlayProgress() {
    let state = store.state
    state.audio.currentTime = 0 // 重新播放
    if (state.currentLyric) {
      state.currentLyric.seek(0)
    }
  },
  // 播放所有歌曲
  playAllSong(list) {
    utils.handlePlayList(null, list, 0)
    utils.resetPlayProgress()
    store.commit('setPlayerFullScreen', true)
  },
  // 比较歌曲
  compareSong(item1, item2) {
    // 判断点击的是否是当前播放的歌曲
    if (item1.id === item2.id) {
      store.commit('setPlayerFullScreen', true)
      return true
    } else {
      return false
    }
  },
  // playRandomMusic(list) {
  //   // 打乱数组
  //   let randomList = utils.randomList(list)
  //   // 获取当前播放歌曲
  //   let currentPlaySong = store.state.currentSong
  //   // 播放全部歌曲，默认将第一首歌作为播放全部时的歌曲
  //   let willPlaySong = randomList[0]
  //   if (currentPlaySong) { // 存在当前播放歌曲
  //     // 如果当前播放歌曲和播放全部歌曲相同则再次打乱数组，直到不相同
  //     while (willPlaySong.id === currentPlaySong.id || willPlaySong.st < 0) {
  //       randomList = utils.randomList(list)
  //       willPlaySong = randomList[0]
  //     }
  //   }
  //   // 获取歌曲索引index传入playMusic
  //   let index = randomList.findIndex(item => item.id === willPlaySong.id)
  //   utils.playMusic(willPlaySong, list, index)
  // },
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
  // 定位歌曲
  positionSong({
    listNode,
    list,
    song,
    otherHeight = 0
  }) {
    // 找到当前播放歌曲的索引
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
  alert({
    message,
    title = null
  }) {
    return Vue.prototype.$Dialog.alert({
      message,
      confirmButtonColor: '#FD4979',
      width: '265px'
    })
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
    if (store.state.token) {
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
  },
  routerBack() {
    store.commit('setIsAdvance', false)
    console.log(store.isAdvance)
    console.log(window.history.length)
    if (window.history.length <= 1) {
      router.push('/')
    } else {
      router.back()
    }
  },
  getNetworkType() {
    var ua = navigator.userAgent
    var networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other'
    networkStr = networkStr.toLowerCase().replace('nettype/', '')
    var networkType
    switch (networkStr) {
      case 'wifi':
        networkType = 'wifi'
        break
      case '4g':
        networkType = '4g'
        break
      case '3g':
        networkType = '3g'
        break
      case '3gnet':
        networkType = '3g'
        break
      case '2g':
        networkType = '2g'
        break
      default:
        networkType = 'other'
    }
    return networkType
  }
}

export {
  utils
}
Vue.prototype.$utils = utils
