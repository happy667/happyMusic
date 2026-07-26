import { useAppStore, usePlayerStore, useUserStore, useSearchStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
import utils from '@/assets/common/js/utils.js'

const Login = () =>
  import( /* webpackChunkName:"login_index_register_findPassword_appIndex" */ '../views/appIndex/Login')
const Index = () =>
  import( /* webpackChunkName:"login_index_register_findPassword_appIndex" */ '../views/appIndex/Index')
const Register = () =>
  import( /* webpackChunkName:"login_index_register_findPassword_appIndex" */ '../views/appIndex/Register')
const FindPassword = () =>
  import( /* webpackChunkName:"login_index_register_findPassword_appIndex" */ '../views/appIndex/FindPassword')
const AppIndex = () =>
  import( /* webpackChunkName:"login_index_register_findPassword_appIndex" */ '../views/AppIndex')

const Home = () =>
  import('../views/Home')
const SongSheetSquare = () =>
  import('../components/home/songSheet/SongSheetSquare')
const SongSheetDisc = () =>
  import('../components/home/songSheet/SongSheetDisc')
const SongSheetComment = () =>
  import('../components/home/songSheet/SongSheetComment')
const VideoInfo = () =>
  import('../components/home/video/VideoInfo')

const Search = () =>
  import( /* webpackChunkName:"search_searchBox_searchResult" */ '../components/home/search/Search')
const SearchBox = () =>
  import( /* webpackChunkName:"search_searchBox_searchResult" */ '../components/home/search/SearchBox')
const SearchResult = () =>
  import( /* webpackChunkName:"search_searchBox_searchResult" */ '../components/home/search/SearchResult')

const Player = () =>
  import('../components/common/Player')
const SongComment = () =>
  import('../components/home/song/SongComment')
const SingerInfo = () =>
  import('../components/home/singer/SingerInfo')
const SingerMoreDesc = () =>
  import('../components/home/singer/SingerMoreDesc')

const Album = () =>
  import('../components/home/singer/album/AlbumInfo')
const AlbumComment = () =>
  import('../components/home/singer/album/AlbumComment')

const User = () =>
  import( /* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../views/User')
const MyFollow = () =>
  import( /* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../components/user/MyFollow')
const MyLike = () =>
  import( /* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../components/user/MyLike')
const PlayRanking = () =>
  import( /* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../components/user/PlayRanking')
const UserRecentPlay = () =>
  import( /* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../components/user/RecentPlay')
const UserEdit = () =>
  import( /* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../components/user/Edit')
const UserEditNickname = () =>
  import( /* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../components/user/edit/EditNickname')
const UserEditPassword = () =>
  import( /* webpackChunkName:"user_myFollow_myLike_playRanking_userRecommend_userEdit" */ '../components/user/edit/EditPassword')

const routes = [
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
    path: '/songSheetSquare',
    name: 'songSheetSquare',
    component: SongSheetSquare,
    meta: {
      title: '歌单广场'
    },
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      if (from.name === 'home') {
        // 添加不缓存路由
        appStore.addNoCacheComponent('songSheetSquare')
      } else {
        // 移除不缓存路由
        appStore.removeNoCacheComponent('songSheetSquare')
      }
      return true
    }
  },
  // 歌单详情
  {
    path: '/songSheetDisc/:id',
    name: 'songSheetDisc',
    component: SongSheetDisc,
    props: true,
    meta: {
      isBack: false,
      title: '歌单详情'
    },
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      if (from.name === 'home' || from.name === 'searchResult' || from.name === 'songSheetSquare' || from.name === 'user') {
        // 添加不缓存路由
        appStore.addNoCacheComponent('songSheetDisc')
      } else if (from.name === 'songSheetComment' && !from.meta.isBack) {
        // 添加不缓存路由
        appStore.addNoCacheComponent('songSheetDisc')
      } else {
        // 移除不缓存路由
        appStore.removeNoCacheComponent('songSheetDisc')
      }
      return true
    }
  },
  // 歌单评论列表
  {
    path: '/songSheetComment/:id',
    name: 'songSheetComment',
    component: SongSheetComment,
    props: true,
    meta: {
      title: '评论列表'
    },
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      if (from.name === 'songSheetDisc' && !from.meta.isBack) {
        // 添加不缓存路由
        appStore.addNoCacheComponent('songSheetComment')
      } else {
        // 移除不缓存路由
        appStore.removeNoCacheComponent('songSheetComment')
      }
      return true
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
        beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
          console.log(from.name)
          if (from.name === 'home') {
            // 添加不缓存路由
            appStore.addNoCacheComponent('search')
          } else {
            // 移除不缓存路由
            appStore.removeNoCacheComponent('search')
          }
          return true
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
        beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
          const searchStore = useSearchStore()
          if (!searchStore.searchKeywords) {
            // 无关键词，重定向到搜索页
            return { path: '/search/searchPage', replace: true }
          } else if (from.name === 'searchPage') {
            // 添加不缓存路由
            appStore.addNoCacheComponent('search')
          } else {
            // 移除不缓存路由
            appStore.removeNoCacheComponent('search')
          }
          return true
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
      isBack: false,
      title: '视频详情'
    },
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      // 如果有歌曲播放就隐藏迷你播放器
      if (playerStore.currentPlayIndex !== -1) {
        playerStore.hideMiniPlayer = true
      }
      if (from.name === 'home' || from.name === 'searchResult') {
        // 添加不缓存路由
        appStore.addNoCacheComponent('videoInfo')
      } else {
        // 移除不缓存路由
        appStore.removeNoCacheComponent('videoInfo')
      }
      return true
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
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      if (from.name === 'singerAlbum' && !from.meta.isBack) {
        // 添加不缓存路由
        appStore.addNoCacheComponent('albumComment')
      } else {
        // 移除不缓存路由
        appStore.removeNoCacheComponent('albumComment')
      }
      return true
    }

  },
  // 歌手信息页
  {
    path: '/singerInfo/:id',
    name: 'singerInfo',
    component: SingerInfo,
    props: true,
    meta: {
      title: '歌手详情'
    },
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      if (from.name === 'home' || from.name === 'searchResult' || from.name === 'singerInfo' || (from.name === 'videoInfo' && !from.meta.isBack) || (from.name === 'singerMoreDesc' && !from.meta.isBack) || from.name === 'myFollow' || playerStore.isPlayerClick) {
        // 添加不缓存路由
        appStore.addNoCacheComponent('singerInfo')
      } else {
        // 移除不缓存路由
        appStore.removeNoCacheComponent('singerInfo')
      }
      return true
    }
  },
  // 歌手更多描述
  {
    path: '/singerMoreDesc/:id',
    name: 'singerMoreDesc',
    component: SingerMoreDesc,
    props: true,
    meta: {
      isBack: false,
      title: '歌手介绍'
    },
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      if (from.name === 'singerInfo') {
        // 添加不缓存路由
        appStore.addNoCacheComponent('singerMoreDesc')
      } else {
        // 移除不缓存路由
        appStore.removeNoCacheComponent('singerMoreDesc')
      }
      return true
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
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      if (from.name === 'singerInfo' || from.name === 'home' || from.name === 'user' || from.name === 'searchResult') {
        // 添加不缓存路由
        appStore.addNoCacheComponent('singerAlbum')
      } else if (from.name === 'albumComment' && !from.meta.isBack) {
        // 添加不缓存路由
        appStore.addNoCacheComponent('singerAlbum')
      } else {
        // 移除不缓存路由
        appStore.removeNoCacheComponent('singerAlbum')
      }
      return true
    }
  },
  // 我的主页
  {
    path: '/user',
    name: 'user',
    component: User,
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      // 如果有歌曲播放就显示迷你播放器
      if (playerStore.currentPlayIndex !== -1) {
        playerStore.hideMiniPlayer = false
      }
      const userStore = useUserStore()
      let user = userStore.user
      if (from.name === 'home' || !user) {
        // 添加不缓存路由
        appStore.addNoCacheComponent('user')
      } else {
        // 移除不缓存路由
        appStore.removeNoCacheComponent('user')
      }
      return true
    }
  },
  // 我的关注
  {
    path: '/user/myFollow',
    name: 'myFollow',
    component: MyFollow,
    meta: {
      requireLogin: true, // 需要登录
      title: '我的关注'
    },
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      if (from.name === 'user') {
        // 添加不缓存路由
        appStore.addNoCacheComponent('myFollow')
      } else {
        // 移除不缓存路由
        appStore.removeNoCacheComponent('myFollow')
      }
      return true
    }
  },
  // 我的最爱
  {
    path: '/user/myLike',
    name: 'myLike',
    component: MyLike,
    meta: {
      requireLogin: true, // 需要登录
      title: '我的最爱'
    },
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      if (from.name === 'user') {
        // 添加不缓存路由
        appStore.addNoCacheComponent('myLike')
      } else {
        // 移除不缓存路由
        appStore.removeNoCacheComponent('myLike')
      }
      return true
    }
  },
  // 听歌排行
  {
    path: '/user/playRanking',
    name: 'playRanking',
    component: PlayRanking,
    meta: {
      requireLogin: true, // 需要登录
      title: '听歌排行'
    },
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      if (from.name === 'user') {
        // 添加不缓存路由
        appStore.addNoCacheComponent('playRanking')
      } else {
        // 移除不缓存路由
        appStore.removeNoCacheComponent('playRanking')
      }
      return true
    }

  },
  // 最近播放
  {
    path: '/user/recentPlay',
    name: 'userRecentPlay',
    component: UserRecentPlay,
    meta: {
      requireLogin: true, // 需要登录
      title: '最近播放'
    },
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      if (from.name === 'user') {
        // 添加不缓存路由
        appStore.addNoCacheComponent('recentPlay')
      } else {
        // 移除不缓存路由
        appStore.removeNoCacheComponent('recentPlay')
      }
      return true
    }
  },
  // 个人主页编辑
  {
    path: '/user/edit',
    name: 'userEdit',
    component: UserEdit,
    meta: {
      requireLogin: true, // 需要登录
      title: '个人信息'
    },
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      if (from.name === 'user') {
        // 添加不缓存路由
        appStore.addNoCacheComponent('userEdit')
      } else if (from.name === 'editNickname' && !from.meta.isBack) {
        // 添加不缓存路由
        appStore.addNoCacheComponent('userEdit')
      } else {
        // 移除不缓存路由
        appStore.removeNoCacheComponent('userEdit')
      }
      return true
    }

  },
  // 修改昵称
  {
    path: '/user/edit/editNickname',
    name: 'editNickname',
    component: UserEditNickname,
    meta: {
      requireLogin: true, // 需要登录
      title: '修改昵称',
      isBack: false
    },
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      to.meta.isBack = false
      // 添加不缓存路由
      appStore.addNoCacheComponent('editNickname')
      return true
    }

  },
  // 修改密码
  {
    path: '/user/edit/editPassword',
    name: 'editPassword',
    component: UserEditPassword,
    meta: {
      requireLogin: true, // 需要登录
      title: '修改密码',
      isBack: false
    },
    beforeEnter (to, from) {
      const appStore = useAppStore();
      const playerStore = usePlayerStore();
      to.meta.isBack = false
      // 添加不缓存路由
      appStore.addNoCacheComponent('editPassword')
      return true
    }

  },
  //处理所有未匹配的路由
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0 }
    }
  }
})
router.beforeEach((to, from) => {
  const playerStore = usePlayerStore();
  const userStore = useUserStore();
  if (to.matched.some(record => record.meta.requireLogin)) { // 判断该路由是否需要登录权限
    if (utils.isLogin()) { // 判断是否登录
      return true
    } else if (from.name !== 'login') {
      // 未登录，弹出确认框
      return utils.alertConfirm({ // 未登录跳转到登录页面
          message: '您还没有登录哦',
          confirmButtonText: '去登陆',
          confirmButtonColor: '#FD4979'
        }).then(() => {
          // 用户点击确认，跳转登录页
          return {
            name: 'login',
            query: {
              redirect: to.fullPath // 未登录则跳转到登陆界面，query:{ redirect: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；
            }
          }
        }).catch(() => {
          // 用户取消，回到个人主页或取消导航
          if (from.name !== 'user') {
            return { name: 'user' } // 回到个人主页
          } else {
            return false // 取消导航
          }
        })
    } else {
      // 已在登录页，但未登录，跳转到 user
      if (from.name !== 'user') {
        return { name: 'user' }
      } else {
        return true
      }
    }
  } else {
    // 不需要登录的路由
    if (playerStore.playerFullScreen) {
      playerStore.playerFullScreen = false
    }
    // 恢复isPlayerClick(这个属性用来判断是否为播放页面点击，如果是则返回时显示全屏播放器)
    playerStore.isPlayerClick = false
    return true
  }
})

export default router