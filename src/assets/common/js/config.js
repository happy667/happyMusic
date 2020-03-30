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
export const defaultMusicImage = 'http://s4.music.126.net/style/web2/img/default/default_album.jpg?param=130y130'
export const logoImage = '/assets/images/Logo.png'
export const logoIndexImage = 'src/assets/images/logoIndex.png'
