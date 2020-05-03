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
const Album = () => import('../components/home/singer/album/AlbumInfo')
const AlbumComment = () => import('../components/home/singer/album/AlbumComment')

const User = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../views/User')
const MyFollow = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../components/user/MyFollow')
const MyLike = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../components/user/MyLike')
const PlayRanking = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../components/user/PlayRanking')
const UserRecommend = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../components/user/Recommend')
const UserEdit = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../components/user/Edit')
const UserEditNickname = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../components/user/edit/EditNickname')
const UserEditPassword = () => import(/* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../components/user/edit/EditPassword')

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
  // 歌单广场页
  {
    path: '/SongSheetSquare',
    name: 'songSheetSquare',
    component: SongSheetSquare,
    meta: {
      title: '歌单广场'
    },
    beforeEnter(to, from, next) {
      if (from.name === 'home') {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'songSheetSquare')
      } else {
        // 移除不缓存路由
        store.commit('setRemoveNoCacheComponents', 'songSheetSquare')
      }
      next()
    }
  },
  // 歌单详情
  {
    path: '/songSheetDisc/:id',
    name: 'songSheetDisc',
    component: SongSheetDisc,
    props: true,
    meta: {
      title: '歌单详情'
    },
    beforeEnter(to, from, next) {
      console.log(from)
      if (from.name === 'home' || from.name === 'searchResult' || from.name === 'songSheetSquare' || from.name === 'user') {
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
      title: '搜索'
    },
    children: [
      // 搜索页面
      {
        path: '/search/searchPage',
        name: 'searchPage',
        component: SearchBox,
        meta: {
          title: '搜索'
        },
        beforeEnter(to, from, next) {
          console.log(from.name)
          if (from.name === 'home') {
            // 添加不缓存路由
            store.commit('setAddNoCacheComponents', 'search')
          } else {
            // 移除不缓存路由
            store.commit('setRemoveNoCacheComponents', 'search')
          }
          next()
        }
      },
      // 搜索结果
      {
        path: '/search/searchResult',
        name: 'searchResult',
        component: SearchResult,
        meta: {
          title: '搜索结果'
        },
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
      title: '视频详情'
    },
    beforeEnter(to, from, next) {
      // 如果有歌曲播放就隐藏迷你播放器
      if (store.state.currentPlayIndex !== -1) {
        store.commit('setHideMiniPlayer', true)
      }
      if (from.name === 'home' || from.name === 'searchResult') {
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
      title: '评论列表'
    }
  },
  // 专辑评论列表
  {
    path: '/albumComment/:id',
    name: 'albumComment',
    component: AlbumComment,
    props: true,
    meta: {
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
      if (from.name === 'singerInfo' || from.name === 'home' || from.name === 'user' || from.name === 'searchResult') {
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
    beforeEnter(to, from, next) {
      // 如果有歌曲播放就显示迷你播放器
      if (store.state.currentPlayIndex !== -1) {
        store.commit('setHideMiniPlayer', false)
      }
      let user = store.state.user
      if (from.name === 'home' || !user) {
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
  },
  // 个人主页编辑
  {
    path: '/user/edit',
    name: 'userEdit',
    component: UserEdit,
    meta: {
      requireLogin: true, // 当前路由需要校验，不需要就不用写
      title: '个人信息'
    },
    beforeEnter(to, from, next) {
      if (from.name === 'user') {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'userEdit')
      } else if (from.name === 'editNickname' && !from.meta.isBack) {
        // 添加不缓存路由
        store.commit('setAddNoCacheComponents', 'userEdit')
      } else {
        // 移除不缓存路由
        store.commit('setRemoveNoCacheComponents', 'userEdit')
      }
      next()
    }

  },
  // 修改昵称
  {
    path: '/user/edit/editNickname',
    name: 'editNickname',
    component: UserEditNickname,
    meta: {
      requireLogin: true, // 当前路由需要校验，不需要就不用写
      title: '修改昵称',
      isBack: false
    },
    beforeEnter(to, from, next) {
      to.meta.isBack = false
      // 添加不缓存路由
      store.commit('setAddNoCacheComponents', 'editNickname')
      next()
    }

  },
  // 修改密码
  {
    path: '/user/edit/editPassword',
    name: 'editPassword',
    component: UserEditPassword,
    meta: {
      requireLogin: true, // 当前路由需要校验，不需要就不用写
      title: '修改密码',
      isBack: false
    },
    beforeEnter(to, from, next) {
      to.meta.isBack = false
      // 添加不缓存路由
      store.commit('setAddNoCacheComponents', 'editPassword')
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
    // 如果路由不是来自歌曲评论或者也不是播放器页面点击的则隐藏全屏播放器，（解决路由跳转时全屏播放器盖住页面)
    if (!from.name === 'songComment' || !store.state.isPlayerClick) {
      store.commit('setPlayerFullScreen', false)
    }
    // 恢复isPlayerClick(这个属性用来判断是否为播放页面点击，如果是则返回时显示全屏播放器)
    store.commit('setIsPlayerClick', false)
    next()
  }
  if (to.matched.some(record => record.meta.requireLogin)) { // 判断该路由是否需要登录权限
    let utils = Vue.prototype.$utils
    console.log(utils.isLogin())
    if (utils.isLogin()) { // 判断是否登录
      next()
    } else if (from.name !== 'login') {
      utils.alertConfirm({ // 未登录跳转到登录页面
        message: '您还没有登录哦',
        confirmButtonText: '去登陆'
      }).then(() => {
        next({
          name: 'login',
          query: {
            redirect: to.fullPath // 未登录则跳转到登陆界面，query:{ redirect: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；
          }
        })
      }).catch(() => {
        if (from.name !== 'user') {
          next({
            name: 'user'
          }) // 回到个人主页
        }
      })
    } else {
      if (from.name !== 'user') {
        next({
          name: 'user'
        }) // 回到个人主页
      }
    }
  } else {
    next()
  }
})
export default router
