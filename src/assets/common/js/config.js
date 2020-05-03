export const PLAY_MODE = {
  sequence: 0, // 顺序播放
  loop: 1, // 单曲循环播放
  random: 2 // 随机播放
}
export const TARGET_TYPE = {
  song: 1, // 歌曲
  video: 1004, // 视频
  album: 10, // 专辑
  songSheet: 1000 // 歌单
}
// 搜索类型

export const SEARCH_TYPE = {
  song: 1,
  album: 10,
  singer: 100,
  songSheet: 1000,
  mv: 1004,
  lyric: 1006,
  all: 1018
}

// 视频类型
export const VIDEO_TYPE = {
  mv: 0,
  video: 1
}
// 歌手类型
export const SINGER_TYPE = {
  maleSinger: '01',
  femaleSinger: '02',
  band: '03'
}
// 歌手类型列表（带名称）
export const SINGER_TYPE_LIST = [{
  typeId: SINGER_TYPE.maleSinger,
  name: '男歌手'
},
{
  typeId: SINGER_TYPE.femaleSinger,
  name: '女歌手'
},
{
  typeId: SINGER_TYPE.band,
  name: '乐队'
}
]
// 地区类型
export const AREA_TYPE = {
  chinese: 10,
  western: 20,
  japan: 60,
  han: 70,
  other: 40
}
// 地区类型列表（带名称）
export const AREA_TYPE_LIST = [{
  typeId: AREA_TYPE.chinese,
  name: '华语'
},
{
  typeId: AREA_TYPE.western,
  name: '欧美'
},
{
  typeId: AREA_TYPE.japan,
  name: '日本'
},
{
  typeId: AREA_TYPE.han,
  name: '韩国'
},
{
  typeId: AREA_TYPE.other,
  name: '其他'
}
]

export const USER_TOKEN = 'token'
// 需要登录的组件

export const NEED_LOGIN_COMPONENTS = [ // 存放路由name属性
  'user',
  'myFollow',
  'myLike',
  'userRecommend',
  'playRanking',
  'userEdit',
  'editNickname',
  'editPassword'
]

export const DEFAULT_IMAGE = 'http://s4.music.126.net/style/web2/img/default/default_album.jpg?param=130y130'
export const DEFAULT_SINGER_IMAGE = 'https://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg'
export const LOGO_IMAGE = '/assets/images/Logo.png'
export const LOGO_INDEX_IMAGE = 'src/assets/images/logoIndex.png'
