<template>
  <div class="header-container">
    <div class="container"></div>
    <div class="tabbar-wrapper">
      <ul class="tabbar-list">
        <li v-for="(item,index) in tabbarList"
            :key="index"
            tag="li"
            @click="changeIndex(index)"
            class="tabbar-item">
          <span class="title"
                :class="currentIndex==index?'active':''">{{item.title}}</span>
          <transition :name="transitionName"
                      mode="out-in"
                      appear>
            <span v-show="currentIndex==index"
                  class="activeItem"></span>
          </transition>

        </li>
      </ul>

    </div>

  </div>
</template>
<script>
// import move from '../common/Move'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      clickIndex: 0, // 当前点击的索引
      transitionName: 'transitionLeft'
    }
  },
  computed: {
    // 接受state中的
    // tabbar列表信息
    // 当前索引
    ...mapState(['tabbarList', 'currentIndex'])
  },
  watch: {
    // 监听索引变化
    currentIndex () {
      const compare = this.currentIndex > this.clickIndex
      this.transitionName = compare ? 'transitionLeft' : 'transitionRight'
    }
  },
  methods: {
    // 接受Mutations中的
    // nextPage()
    // prevPage()
    ...mapMutations(['nextPage', 'prevPage', 'setCurrentIndex']),
    // 切换不同页面
    changeIndex (index) {
      this.clickIndex = index
      this.setCurrentIndex(index)
    }
  },
  components: {
  }
}
</script>
 <style lang="stylus" scoped>
 @import '~common/stylus/variable';

 .transitionLeft-enter, .transitionRight-leave-active {
   opacity: 0;
   transform: translate3d(0%, 0, 0);
   transition: all 0.7s ease; /* 定义动画的时间和过渡效果 */
   /* 当左滑进入右滑进入过渡动画 */
 }

 .transitionLeft-leave-active, .transitionRight-enter {
   opacity: 0;
   transform: translate3d(-100%, 0, 0);
   transition: all 0.7s ease; /* 定义动画的时间和过渡效果 */
 }

 .header-container {
   .container {
     width: 100%;
     height: 2rem;
   }

   .tabbar-wrapper {
     position: fixed;
     left: 0;
     top: 0;
     width: 100%;
     z-index: 10;

     .tabbar-list {
       width: 100%;
       display: flex;
       background: #fff;
       text-align: center;
       font-size: $font-size-small;
       color: $color-common-x;
       font-family: $font-title;

       .tabbar-item {
         flex: 1;
         height: 2rem;
         line-height: 2rem;
         position: relative;

         .active {
           color: $color-common;
           transition: all 0.3s;
         }

         .activeItem {
           content: '';
           display: block;
           position: absolute;
           background: $color-common;
           left: 50%;
           bottom: 0;
           margin-left: -1.2rem;
           width: 2.4rem;
           height: 0.1rem;
         }
       }
     }
   }
 }
</style>