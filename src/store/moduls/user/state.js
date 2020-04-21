import {
  USER_TOKEN
} from '@/assets/common/js/config.js'
import {
  getItem
} from 'common/js/localStorage.js'

export default {
  token: getItem(USER_TOKEN), // token
  user: null, // 登录的用户
  userLikeList: null, // 用户喜欢列表
  userRecommendIndex: 0 // 用户每日推荐页当前索引
}
