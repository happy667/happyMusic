import Vue from 'vue'
import store from '@/store/index.js'
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
const MyFollow = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend" */ '../components/user/MyFollow')
const MyLike = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend" */ '../components/user/MyLike')
const PlayRanking = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend" */ '../components/user/PlayRanking')
const UserRecommend = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend" */ '../components/user/Recommend')

Vue.use(VueRouter)

const routes = [
  // 重定向到首页
  {
    path: '*',
    redirect: '/home'
  },
  // 重定向到登录页
  {
    path: '/appIndex',
    redirect: 'appIndex/index'

  },
  {
    path: '/index',
    redirect: 'appIndex/index'
  },
  // 首页
  {
    path: '/appIndex',
    name: 'appIndex',
    component: AppIndex,
    children: [
      // 跳转到登录首页
      {
        path: 'index',
        name: 'index',
        component: Index,
        meta: {
          index: 1
        }
      },
      // 跳转到登录页面
      {
        path: 'login',
        name: 'login',
        component: Login,
        meta: {
          index: 2
        }

      },

      // 跳转到注册页面
      {
        path: 'register',
        name: 'register',
        component: Register,
        meta: {
          index: 2
        }
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
    component: Home,
    meta: {
      index: 0
    } // meta对象的index用来定义当前路由的层级,由小到大,由低到高
  },
  // 歌单广场页
  {
    path: '/SongSheetSquare',
    name: 'songSheetSquare',
    component: SongSheetSquare,
    meta: {
      index: 1,
      title: '歌单广场'
    } // meta对象的index用来定义当前路由的层级,由小到大,由低到高
  },
  // 歌单详情
  {
    path: '/songSheetDisc/:id',
    name: 'songSheetDisc',
    component: SongSheetDisc,
    props: true,
    meta: {
      index: 4,
      title: '歌单详情'
    }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高
    beforeEnter(to, from, next) {
      console.log(from)
      if (from.name === 'home' || from.name === 'searchResult') {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'songSheetDisc')
      } else {
        // 移除不缓存路由
        store.commit('setRemoveNoCacheComponents', 'songSheetDisc')
      }
      next()
    }
  },
  // 搜索页
  {
    path: '/search',
    name: 'search',
    component: Search,
    redirect: 'searchPage',
    meta: {
      index: 1,
      title: '搜索'
    }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高
    beforeEnter(to, from, next) {
      console.log(from, to)
      if (from.name === 'home') {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'search')
        store.commit('setAddNoCacheComponents', 'searchPage')
      } else {
        // 移除不缓存路由
        store.commit('setRemoveNoCacheComponents', 'search')
        store.commit('setRemoveNoCacheComponents', 'searchPage')
      }
      next()
    },
    children: [
      // 搜索页面
      {
        path: '/search/searchPage',
        name: 'searchPage',
        component: SearchBox,
        meta: {
          index: 1,
          title: '搜索'
        } // meta对象的index用来定义当前路由的层级,由小到大,由低到高
      },
      // 搜索结果
      {
        path: '/search/searchResult',
        name: 'searchResult',
        component: SearchResult,
        meta: {
          index: 3,
          title: '搜索结果'
        }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高
        beforeEnter(to, from, next) {
          if (!store.state.searchKeywords) {
            router.replace('/search/searchPage')
          } else if (from.name === 'searchPage') {
            // 添加不缓存路由
            store.commit('setAddNoCacheComponents', 'search')
          } else {
            // 移除不缓存路由
            store.commit('setRemoveNoCacheComponents', 'search')
          }

          next()
        }

      }
    ]
  },
  // mv详情页
  {
    path: '/videoInfo/:id',
    name: 'videoInfo',
    component: VideoInfo,
    props: true,
    meta: {
      index: 4,
      title: '视频详情'
    }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高
    beforeEnter(to, from, next) {
      console.log(from)
      if (from.name === 'home' || from.name === 'searchResult' || from.name === 'videoInfo') {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'videoInfo')
      } else {
        // 移除不缓存路由
        store.commit('setRemoveNoCacheComponents', 'videoInfo')
      }
      next()
    }
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
    props: true,
    meta: {
      index: 6,
      title: '评论列表'
    } // meta对象的index用来定义当前路由的层级,由小到大,由低到高
  },
  // 专辑评论列表
  {
    path: '/albumComment/:id',
    name: 'albumComment',
    component: AlbumComment,
    props: true,
    meta: {
      isBack: false,
      title: '评论列表'
    },
    beforeEnter(to, from, next) {
      if (from.name === 'singerAlbum' && !from.meta.isBack) {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'albumComment')
      } else {
        // 移除不缓存路由
        store.commit('setRemoveNoCacheComponents', 'albumComment')
      }
      next()
    }

  },
  // 歌手信息页
  {
    path: '/singerInfo/:id',
    name: 'singerInfo',
    component: SingerInfo,
    props: true,
    meta: {
      keepAlive: false, // 不需要缓存
      index: 5,
      title: '歌手详情'
    },
    beforeEnter(to, from, next) {
      if (from.name === 'home' || from.name === 'searchResult' || from.name === 'videoInfo' || from.name === 'myFollow' || store.state.isPlayerClick) {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'singerInfo')
      } else {
        // 移除不缓存路由
        store.commit('setRemoveNoCacheComponents', 'singerInfo')
      }
      next()
    }
  },
  // 歌手专辑详情页
  {
    path: '/singerAlbum/:id',
    name: 'singerAlbum',
    component: Album,
    props: true,
    meta: {
      isBack: false,
      title: '专辑详情'
    },
    beforeEnter(to, from, next) {
      console.log(from)
      if (from.name === 'singerInfo' || from.name === 'home') {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'singerAlbum')
      } else if (from.name === 'albumComment' && !from.meta.isBack) {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'singerAlbum')
      } else {
        // 移除不缓存路由
        store.commit('setRemoveNoCacheComponents', 'singerAlbum')
      }
      next()
    }
  },
  // 我的主页
  {
    path: '/user',
    name: 'user',
    component: User,
    meta: {
      index: 0
    }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高
    beforeEnter(to, from, next) {
      if (from.name === 'home') {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'user')
      } else {
        // 移除不缓存路由
        store.commit('setRemoveNoCacheComponents', 'user')
      }
      next()
    }
  },
  // 我的关注
  {
    path: '/user/myFollow',
    name: 'myFollow',
    component: MyFollow,
    meta: {
      requireLogin: true, // 当前路由需要校验，不需要就不用写
      index: 2,
      title: '我的关注'
    },
    beforeEnter(to, from, next) {
      if (from.name === 'user') {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'myFollow')
      } else {
        // 移除不缓存路由
        store.commit('setRemoveNoCacheComponents', 'myFollow')
      }
      next()
    }
  },
  // 我的最爱
  {
    path: '/user/myLike',
    name: 'myLike',
    component: MyLike,
    meta: {
      requireLogin: true, // 当前路由需要校验，不需要就不用写
      index: 2,
      title: '我的最爱'
    },
    beforeEnter(to, from, next) {
      if (from.name === 'user') {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'myLike')
      } else {
        // 移除不缓存路由
        store.commit('setRemoveNoCacheComponents', 'myLike')
      }
      next()
    }
  },
  // 听歌排行
  {
    path: '/user/playRanking',
    name: 'playRanking',
    component: PlayRanking,
    meta: {
      requireLogin: true, // 当前路由需要校验，不需要就不用写
      index: 2,
      title: '听歌排行'
    },
    beforeEnter(to, from, next) {
      if (from.name === 'user') {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'playRanking')
      } else {
        // 移除不缓存路由
        store.commit('setRemoveNoCacheComponents', 'playRanking')
      }
      next()
    }

  },
  // 用户推荐
  {
    path: '/user/recommend',
    name: 'userRecommend',
    component: UserRecommend,
    meta: {
      requireLogin: true, // 当前路由需要校验，不需要就不用写
      index: 2,
      title: '每日推荐'
    },
    beforeEnter(to, from, next) {
      if (from.name === 'user') {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'userRecommend')
      } else {
        // 移除不缓存路由
        store.commit('setRemoveNoCacheComponents', 'userRecommend')
      }
      next()
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
  if (store.state.playerFullScreen) {
    if (from.name === 'songComment' || store.state.isPlayerClick) {
      next()
    } else {
      store.commit('setPlayerFullScreen', false)
      next(false)
    }
    store.commit('setIsPlayerClick', false)
  }
  if (window.history.length === 0) { // 说明没有上一个路由
    next('/') // 回到首页
  } else if (to.matched.some(record => record.meta.requireLogin)) { // 判断该路由是否需要登录权限
    let utils = Vue.prototype.utils
    console.log(utils.isLogin())
    if (utils.isLogin()) { // 判断是否登录
      next()
    } else {
      utils.alertConfirm({ // 未登录跳转到登录页面
        message: '您还没有登录哦',
        confirmButtonText: '去登陆'
      }).then(() => {
        // 设置为前进页面
        store.commit('setIsAdvance', true)
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
