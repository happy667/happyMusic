export const playMode = {
  sequence: 0, // 顺序播放
  loop: 1, // 单曲循环播放
  random: 2 // 随机播放
}
export const targetType = {
  song: 1, // 歌曲
  video: 1004, // 视频
  album: 10, // 专辑
  songSheet: 1000 // 歌单
}
// 搜索类型

export const searchType = {
  song: 1,
  album: 10,
  singer: 100,
  songSheet: 1000,
  mv: 1004,
  lyric: 1006,
  all: 1018
}

// 视频类型
export const videoType = {
  mv: 0,
  video: 1
}
export const USER_TOKEN = 'token'
// 需要登录的组件
export const needLoginComponents = [ // 存放路由name属性
  'user',
  'myFollow',
  'myLike',
  'userRecommend',
  'playRanking',
  'userEdit',
  'editNickname',
  'editPassword'
]
export const defaultImage = 'http://s4.music.126.net/style/web2/img/default/default_album.jpg?param=130y130'
export const logoImage = '/assets/images/Logo.png'
export const logoIndexImage = 'src/assets/images/logoIndex.png'
