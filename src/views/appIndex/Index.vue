<template>
  <div class="index-container">
    <div class="container">
      <!-- logo -->
      <transition name="fade"
                  mode="out-in"
                  appear>
        <div class="logo">
          <img src="@/assets/images/logoIndex.png" class="animated fadeIn" />
        </div>
      </transition>

      <!-- 操作 -->
      <div class="option">
        <router-link to="/appIndex/login"
                     tag="div">
          <btn text="登录" />
        </router-link>
        <p>OR</p>
        <!-- 注册 -->
        <router-link to="/appIndex/register"
                     tag="div">
          <btn text="注册" />
        </router-link>
      </div>
      <!-- 游客登录 -->
      <div class="visitor-login"
           @click="handleVisitorLogin">
        <a href="JavaScript:;">游客登录</a>
      </div>
    </div>
  </div>
</template>
<script>
    import Btn from '@/components/common/Button'
    export default {
        name: 'index',
        methods: {
            // 显示隐藏密码
            handleVisitorLogin() {
                this.$router.replace('/home')
            }
        },
        components: {
            Btn
        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .fade-enter {
        opacity: 0;
    }
    
    .fade-enter-active {
        transition: opacity 1s;
    }
    
    .fade-enter-to {
        opacity: 1;
    }
    
    .index-container {
        width: 100%;
        .container {
            height: 100%;
            .logo {
                margin: 0 auto 1rem;
                width: 6.5rem;
                height: 6rem;
                text-align: center;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .option {
                display: flex;
                height: 6rem;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                text-align: center;
                div {
                    width: 6.5rem;
                }
                p {
                    color: $color-common;
                    font-weight: bolder;
                    font-size: $font-size-small;
                }
            }
            .visitor-login {
                height: 1rem;
                line-height: 1rem;
                text-align: center;
                font-size: $font-size-smaller;
            }
        }
    }
</style>