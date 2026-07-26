<template>
  <div id="app">
    <!-- 使用 v-slot 插槽获取组件 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <!-- 将 v-if 移到此处，控制是否渲染 -->
        <keep-alive :exclude="noCacheComponents" v-if="isRouterAlive">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
    <player></player>
  </div>
</template>

<script>
import loginApi from "@/api/login.js";
import { ERR_OK } from "@/api/config.js";
import { USER_TOKEN, NEED_LOGIN_COMPONENTS } from "@/assets/common/js/config.js";
import { getItem, clearItem } from "common/js/localStorage.js";
import Player from "@/components/common/Player";
import { mapWritableState, mapState, mapActions } from 'pinia'

import { useUserStore, useAppStore, usePlayerStore } from '@/stores'

export default {
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      transitionName: "",
      isRouterAlive: true,
    };
  },
  computed: {
    ...mapWritableState(useUserStore, ['user', 'token']),
    ...mapWritableState(useAppStore, ['noCacheComponents']),
    ...mapState(usePlayerStore, ['currentSong']),
  },
  mounted() {
    if (this.token) {
      // 获取用户信息
      this.getLoginUserInfo();
    }
    // 监听Storage变化
    this.listenerStorage();
    // 监听网络连接
    this.listenerNetWork();
  },
  destroyed() {
    this.removeListener();
    this.removeListenerNetWork();
  },
  methods: {
    ...mapActions(useUserStore, ['getLoginUserInfo', 'getUserLikeList']),
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
    listenerStorage() {
      // 监听storage变化
      window.addEventListener("storage", this.handleStorageChange);
    },
    handleStorageChange() {
      let token = getItem(USER_TOKEN);
      if (!token) {
        this.logout();
      }
    },
    // 移除监听storage器
    removeListener() {
      window.removeEventListener("storage", this.handleStorageChange);
    },
    // 退出登录
    logout() {
      loginApi.logout().then((res) => {
        if (res.data.code === ERR_OK) {
          // 清空用户所有信息
          clearItem(USER_TOKEN);
          this.user = null;
          this.token = null;
          this.userLikeList = null;
          let name = this.$route.name;
          // 判断当前路由是否为需要登录，如果是的话就刷新页面,否则跳转到用户首页
          if (NEED_LOGIN_COMPONENTS.includes(this.$route.name)) {
            // 添加不缓存路由
            this.addNoCacheComponent("user");
            if (name === "user") {
              this.reload();
            } else {
              this.$router.replace({
                name: "user",
              });
            }
          }
        } else {
          this.$toast(res.data.message);
        }
      });
    },
    listenerNetWork() {
      window.addEventListener("offline", this.handleOffline);
      window.addEventListener("online", this.handleOnline);
    },
    handleOffline() {
      this.$toast("网络已断开，请检查网络");
    },
    handleOnline() {
      this.$toast("网络已连接,请刷新页面");
    },
    removeListenerNetWork() {
      window.removeEventListener("offline", this.handleOffline);
      window.removeEventListener("online", this.handleOnline);
    },
  },
  components: {
    Player,
  },
};
</script>
<style lang="stylus" scoped>
// 转场动画
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

#app :deep(.van-popup .singerList){
  max-height: 6rem;
  padding-top: 0.1rem;
}
</style>
