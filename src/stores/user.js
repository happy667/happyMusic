import { defineStore } from 'pinia'
import { USER_TOKEN } from '@/assets/common/js/config.js'
import { getItem } from 'common/js/localStorage.js'
import loginApi from '@/api/login.js'
import userApi from '@/api/user.js'
import { ERR_OK } from '@/api/config.js'

export const useUserStore = defineStore('user', {
  state: () => ({ token: getItem(USER_TOKEN), user: null, userLikeList: null }),
  actions: {
    async getLoginUserInfo () {
      const { data: res } = await loginApi.loginStatus(this.token);
      if (res.data.code === ERR_OK) { this.user = res.data.profile; await this.getUserLikeList(this.user.userId); }
    },
    async getUserLikeList (id) {
      const { data: res } = await userApi.getUserLikeList(id);
      if (res.code === ERR_OK) this.userLikeList = res.ids;
    }
  }
})