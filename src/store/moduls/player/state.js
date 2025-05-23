import {
    PLAY_MODE
} from '@/assets/common/js/config.js'

export default {
    playing: false, // 播放状态
    playList: [], // 播放列表
    playerFullScreen: false, // 是否展开播放
    sequenceList: [], // 顺序播放列表
    playMode: PLAY_MODE.sequence, // 播放模式
    currentPlayIndex: -1, // 当前播放索引
    togglePlayList: false, // 显示隐藏播放列表
    songReady: false, // 歌曲是否加载完毕
    playerShowImage: true, // 显示播放器图片
    currentLyric: null, // 设置一个歌词维护属性
    currentLineNum: 0, // 当前高亮的歌词行
    currentPlayLyric: '', // 当前播放的歌词
    hideMiniPlayer: false, // 隐藏迷你播放器
    isPlayerClick: false, // 是否为播放页面点击的
    songLoading: false, //歌曲是否在加载
    songSpeed: 1, // 歌曲播放速度
    songSpeedPopup: false // 歌曲播放速度弹窗
}