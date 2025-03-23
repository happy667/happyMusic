<template>
  <div class="appIndex-container">
    <!-- back -->
    <div class="back"
         @click="$utils.routerBack()">
      <van-icon name="arrow-left" />
    </div>
    <!-- 二维码登录 -->
    <!-- <div class="qr-login"
         @click="qrLogin()">二维码登录</div>
    <van-dialog v-model="showQrLoginPopup"
                title="二维码登录"
                @cancel="clearQRInterval(QRInterVal)"
                @close="clearQRInterval(QRInterVal)"
                show-cancel-button>
      <img :src="qrImg" />
      <div class="qr-login-tips">请使用手机APP扫码登录</div>
    </van-dialog> -->
    <router-view></router-view>
  </div>

</template>
<script>
import loginApi from '@/api/login.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  mapMutations
} from 'vuex'
import {
  setItem
} from 'common/js/localStorage.js'
import {
  USER_TOKEN
} from '@/assets/common/js/config.js'
export default {
  name: 'appIndex',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 如果有歌曲播放就隐藏迷你播放器
      if (vm.$store.state.currentPlayIndex !== -1) {
        vm.$store.commit('setHideMiniPlayer', true)
      }
      next()
    })
  },
  beforeRouteLeave (to, from, next) {
    // 如果有歌曲播放就显示迷你播放器
    if (this.$store.state.currentPlayIndex !== -1) {
      this.$store.commit('setHideMiniPlayer', false)
    }
    next()
  },
  data () {
    return {
      showQrLoginPopup: false,
      qrImg: '',
      key: '',
      QRInterVal: null
    }
  },

  methods: {
    ...mapMutations(['setLoginUser', 'setToken']),
    clearQRInterval (interval) {
      clearInterval(interval)
    },
    async qrLogin () {
      this.showQrLoginPopup = true
      //生成二维码key
      const { data: res } = await loginApi.createQRKey()
      if (res.code === ERR_OK) {
        const key = res.data.unikey
        this.key = key
        //获取二维码图片
        this.getQrLoginImg(key);
        //轮询检查二维码登录状态
        this.QRInterVal = setInterval(async () => { this.checkQrLoginState(key) }, 500);
      }
    },
    //获取二维码图片
    async getQrLoginImg (key) {
      const { data: res } = await loginApi.createQR(key);
      if (res.code === ERR_OK) {
        this.qrImg = res.data.qrimg
      }
    },
    //检查二维码登录状态
    async checkQrLoginState (key) {
      const { data: res } = await loginApi.checkQR(key);
      switch (res.code) {
        case 800:
          //二维码过期
          this.getQrLoginImg(key);
          break;
        case 801:
          //等待扫码
          break;
        case 802:
          //等待确认
          break;
        case 803:
          //登录成功
          this.clearQRInterval(this.QRInterVal)
          this.login(res.cookie);
          break;
      }
    },
    login (cookie) {
      console.log(cookie)
      this.$toast.loading({
        message: '登陆中...',
        duration: 10000,
        forbidClick: true
      })
      const { data: res } = loginApi.loginStatus(cookie)
      console.log(res)
      if (res.data.code === ERR_OK) {
        console.log('登录成功')
        // 保存token信息
        setItem(USER_TOKEN, cookie)
        this.setToken(cookie)
        this.setLoginUser(res.data.profile)

        if (this.$router.currentRoute.query.redirect) { // 跳回到原来页面
          // 使用replace是为了不保留登录页面历史记录
          this.$router.replace(this.$router.currentRoute.query.redirect)
          this.$router.go(-1) // 这里执行go是为了解决需要返回两次才能回退上一个页面的问题
        } else {
          this.$router.replace('/home')
        }
        this.$toast.clear()
      }
    }
  }

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.appIndex-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  background: $color-common-background;

  .back {
    position: absolute;
    left: 0.2rem;
    top: 0.25rem;
    width: 1rem;
    height: 1rem;
    font-size: $font-size-large;
    color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>