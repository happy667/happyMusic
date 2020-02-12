import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName:"login_index_register_findPassword_appIndex" */ '../views/appIndex/Login')
const Index = () => import(/* webpackChunkName:"login_index_register_findPassword_appIndex" */ '../views/appIndex/Index')
const Register = () => import(/* webpackChunkName:"login_index_register_findPassword_appIndex" */ '../views/appIndex/Register')
const FindPassword = () => import(/* webpackChunkName:"login_index_register_findPassword_appIndex" */ '../views/appIndex/FindPassword')
const AppIndex = () => import(/* webpackChunkName:"login_index_register_findPassword_appIndex" */ '../views/AppIndex')

const Home = () => import('../views/Home')
const SongSheetSquare = () => import('../components/home/songSheet/SongSheetSquare')
const SongSheetDisc = () => import('../components/home/songSheet/SongSheetDisc')
const VideoInfo = () => import('../components/home/video/VideoInfo')

const Search = () => import(/* webpackChunkName:"search_searchBox_searchResult" */ '../components/home/search/Search')
const SearchBox = () => import(/* webpackChunkName:"search_searchBox_searchResult" */ '../components/home/search/SearchBox')
const SearchResult = () => import(/* webpackChunkName:"search_searchBox_searchResult" */ '../components/home/search/SearchResult')

const Player = () => import('../components/common/Player')
const SongComment = () => import('../components/home/song/SongComment')
const SingerInfo = () => import('../components/home/singer/SingerInfo')
const Album = () => import('../components/home/singer/album/Album')
const AlbumComment = () => import('../components/home/singer/album/AlbumComment')

const User = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend" */ '../views/User')
const MyFollow = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend" */'../components/user/MyFollow')
const MyLike = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend" */'../components/user/MyLike')
const PlayRanking = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend" */'../components/user/PlayRanking')
const UserRecommend = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend" */'../components/user/Recommend')

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
      // 搜索页面
      {
        path: '/search/searchPage',
        name: 'searchPage',
        component: SearchBox
      },
      // 搜索结果
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
  },
  // 我的主页
  {
    path: '/user',
    name: 'user',
    component: User
  },
  // 我的关注
  {
    path: '/user/myFollow',
    name: 'myFollow',
    component: MyFollow,
    meta: {
      requireLogin: true // 当前路由需要校验，不需要就不用写
    }
  },
  // 我的最爱
  {
    path: '/user/myLike',
    name: 'myLike',
    component: MyLike,
    meta: {
      requireLogin: true // 当前路由需要校验，不需要就不用写
    }
  },
  // 听歌排行
  {
    path: '/user/playRanking',
    name: 'playRanking',
    component: PlayRanking,
    meta: {
      requireLogin: true // 当前路由需要校验，不需要就不用写
    }

  },
  // 用户推荐
  {
    path: '/user/recommend',
    name: 'userRecommend',
    component: UserRecommend,
    meta: {
      requireLogin: true // 当前路由需要校验，不需要就不用写
    }
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
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireLogin)) { // 判断该路由是否需要登录权限
    let utils = Vue.prototype.utils
    console.log(utils.isLogin())
    if (utils.isLogin()) { // 判断是否登录
      next()
    } else {
      utils.alertConfirm({ // 未登录跳转到登录页面
        message: '您还没有登录哦',
        confirmButtonText: '去登陆'
      }).then(() => {
        next({
          name: 'login',
          query: {
            redirect: to.fullPath // 未登录则跳转到登陆界面，query:{ Rurl: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；
          }
        })
      }).catch(() => {
        if (from.name !== 'user') {
          next({
            name: 'user'
          }) // 回到个人主页
        }
      })
    }
  } else {
    next()
  }
})
export default router
