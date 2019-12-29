import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../views/appIndex/Login')
const Index = () => import('../views/appIndex/Index')
const Register = () => import('../views/appIndex/Register')
const AppIndex = () => import('../views/AppIndex')
const Home = () => import('../views/Home')
const SongSheetSort = () => import('../components/home/songSheet/SongSheetSort')
const SongSheetInfo = () => import('../components/home/songSheet/SongSheetInfo')
const VideoInfo = () => import('../components/home/video/VideoInfo')
const Search = () => import('../components/home/search/Search')
const Play = () => import('../components/home/play/Play')
const SongComment = () => import('../components/home/song/SongComment')
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
      }
    ]
  },
  // 音乐app首页
  {
    path: '/home',
    name: 'home',
    component: Home,
    children: [

      //   // 排行页
      //   {
      //     path: 'Ranking',
      //     component: Ranking
      //   },
      //   // 歌手页
      //   {
      //     path: 'Singer',
      //     component: Singer
      //   },
      //   // 搜索页
      //   {
      //     path: 'Search',
      //     component: Search
      //   }
    ]
  },
  // 歌单页
  {
    path: '/songSheetSort',
    name: 'songSheetSort',
    component: SongSheetSort
  },
  // 歌单详情
  {
    path: '/songSheetInfo/:id',
    name: 'songSheetInfo',
    component: SongSheetInfo,
    props: true
  },
  // 搜索页
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  // mv详情页
  {
    path: '/videoInfo',
    name: 'videoInfo',
    component: VideoInfo
  },
  // 播放页面
  {
    path: '/play',
    name: 'play',
    component: Play
  },
  // 歌曲评论列表
  {
    path: '/songComment',
    name: 'songComment',
    component: SongComment

  }
]

const router = new VueRouter({
  routes
})

export default router
