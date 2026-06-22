<template>
  <div class="header-navBar-container" ref="navBar">
    <!-- 头部导航栏 -->
    <van-tabs
      v-model="currentIndex"
      @change="handleChange"
      title-active-color="#FD4979"
      color="#FD4979"
      animated
      swipeable
      lazy-render
    >
      <!-- 推荐页 -->
      <van-tab title="推荐">
        <Recommend ref="recommend" />
      </van-tab>
      <!-- 排行页 -->
      <van-tab title="排行">
        <ranking ref="ranking" @refreshList="handlePlaylist(this.playList)" />
      </van-tab>
      <!-- 歌手页 -->
      <van-tab title="歌手">
        <singer ref="singer" />
      </van-tab>
      <!-- 搜索页 -->
      <van-tab title="MV">
        <video-list ref="mv" />
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import Recommend from "@/components/home/recommend/Recommend";
import Ranking from "@/components/home/ranking/Ranking";
import Singer from "@/components/home/singer/Singer";
import VideoList from "@/components/home/video/VideoList";
import { playlistMixin } from "@/assets/common/js/mixin.js";
import { mapState } from "vuex";
export default {
  mixins: [playlistMixin],
  mounted() {
    // Vant 4 升级后 swipeable tabs 滑动仍会合成 click，需在 capture 阶段拦截
    if (!window.__tabSwipeClickFix) {
      window.__tabSwipeClickFix = true;
      let swiped = false,
        sx = 0,
        sy = 0;
      document.addEventListener(
        "touchstart",
        (e) => {
          if (e.touches.length === 1) {
            sx = e.touches[0].clientX;
            sy = e.touches[0].clientY;
            swiped = false;
          }
        },
        { passive: true }
      );
      document.addEventListener(
        "touchmove",
        (e) => {
          if (e.touches.length === 1) {
            const dx = e.touches[0].clientX - sx,
              dy = e.touches[0].clientY - sy;
            if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) swiped = true;
          }
        },
        { passive: true, capture: true }
      );
      document.addEventListener(
        "click",
        (e) => {
          if (swiped) {
            swiped = false;
            e.stopPropagation();
            e.preventDefault();
          }
        },
        true
      );
    }
  },
  computed: {
    ...mapState(["oldVideo"]),
    currentIndex: {
      get() {
        return this.$store.state.homeCurrentIndex;
      },
      set(index) {
        this.$store.commit("setHomeCurrentIndex", index);
      },
    },
  },
  methods: {
    handleChange() {
      this.handlePlaylist(this.playList);
      if (this.currentIndex === 3) return;
      if (this.oldVideo.$data && this.oldVideo.$data.isPlay) {
        this.oldVideo.pauseCurrentVideo();
      }
    },
    handlePlaylist(playList) {
      // 适配播放器与页面底部距离
      const bottom = playList.length > 0 ? "1.5rem" : "";
      this.$nextTick(() => {
        // 根据当前索引获取对应的子组件 ref 名称
        const refMap = {
          0: "recommend",
          1: "ranking",
          2: "singer",
          3: "mv",
        };
        const refName = refMap[this.currentIndex];
        if (!refName) return;
        const child = this.$refs[refName];
        // 判空：child 存在且有 $refs.container
        if (child && child.$refs && child.$refs.container) {
          child.$refs.container.style.paddingBottom = bottom;
          if (typeof child.refresh === "function") {
            child.refresh();
          }
        }
      });
    },
  },
  components: {
    Recommend,
    Ranking,
    Singer,
    VideoList,
  },
};
</script>
<style lang="stylus" scoped></style>
