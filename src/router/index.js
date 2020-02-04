import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../views/appIndex/Login')
const Index = () => import('../views/appIndex/Index')
const Register = () => import('../views/appIndex/Register')
const FindPassword = () => import('../views/appIndex/FindPassword')
const AppIndex = () => import('../views/AppIndex')
const Home = () => import('../views/Home')
const SongSheetSquare = () => import('../components/home/songSheet/SongSheetSquare')
const SongSheetDisc = () => import('../components/home/songSheet/SongSheetDisc')
const VideoInfo = () => import('../components/home/video/VideoInfo')
const Search = () => import('../components/home/search/Search')
const SearchBox = () => import('../components/home/search/SearchBox')
const SearchResult = () => import('../components/home/search/SearchResult')
const Player = () => import('../components/common/Player')
const SongComment = () => import('../components/home/song/SongComment')
const SingerInfo = () => import('../components/home/singer/SingerInfo')
const Album = () => import('../components/home/singer/album/Album')
const AlbumComment = () => import('../components/home/singer/album/AlbumComment')

Vue.use(VueRouter)

const routes = [
  // 重定向到首页
  {
    path: '*',
    redirect: '/home'
  },
  {
    path: '/appIndex',
    redirect: '/appIndex/Index'
  },

  // 首页
  {
    path: '/appIndex',
    component: AppIndex,
    children: [
      // 跳转到首页
      {
        path: 'index',
        name: 'index',
        component: Index
      },
      // 跳转到登录页面
      {
        path: 'login',
        name: 'login',
        component: Login
      },

      // 跳转到注册页面
      {
        path: 'register',
        name: 'register',
        component: Register
      },
      {
        path: 'findPassword',
        name: 'findPassword',
        component: FindPassword
      }
    ]
  },
  // 音乐app首页
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  // 歌单页
  {
    path: '/SongSheetSquare',
    name: 'SongSheetSquare',
    component: SongSheetSquare
  },
  // 歌单详情
  {
    path: '/songSheetDisc/:id',
    name: 'songSheetDisc',
    component: SongSheetDisc,
    props: true
  },
  // 搜索页
  {
    path: '/search',
    name: 'search',
    component: Search,
    redirect: 'searchPage',
    children: [
      {
        path: '/search/searchPage',
        name: 'searchPage',
        component: SearchBox
      },
      {
        path: '/search/searchResult',
        name: 'searchResult',
        component: SearchResult
      }
    ]
  },
  // mv详情页
  {
    path: '/videoInfo/:id',
    name: 'videoInfo',
    component: VideoInfo,
    props: true
  },
  // 播放页面
  {
    path: '/play',
    name: 'play',
    component: Player
  },
  // 歌曲评论列表
  {
    path: '/songComment/:id',
    name: 'songComment',
    component: SongComment,
    props: true

  },
  // 专辑评论列表
  {
    path: '/albumComment/:id',
    name: 'albumComment',
    component: AlbumComment,
    props: true

  },
  // 歌手信息页
  {
    path: '/singerInfo/:id',
    name: 'singerInfo',
    component: SingerInfo,
    props: true
  },
  // 歌手专辑详情页
  {
    path: '/singerAlbum/:id',
    name: 'singerAlbum',
    component: Album,
    props: true
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})
export default router
