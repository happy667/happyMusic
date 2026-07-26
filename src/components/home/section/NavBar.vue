<template>
  <div class="header-navBar-container" ref="navBar">
    <!-- 头部导航栏 -->
    <van-tabs
      v-model:active="currentIndex"
      @change="handleChange"
      title-active-color="#FD4979"
      color="#FD4979"
      animated
      swipeable
    >
      <!-- 推荐页 -->
      <van-tab title="推荐">
        <SwipeGuard>
          <Recommend ref="recommend" />
        </SwipeGuard>
      </van-tab>
      <!-- 排行页 -->
      <van-tab title="排行">
        <SwipeGuard>
          <Ranking ref="ranking" />
        </SwipeGuard>
      </van-tab>
      <!-- 歌手页 -->
      <van-tab title="歌手">
        <SwipeGuard>
          <Singer ref="singer" />
        </SwipeGuard>
      </van-tab>
      <!-- 搜索页 -->
      <van-tab title="MV">
        <SwipeGuard>
          <VideoList ref="mv" />
        </SwipeGuard>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import Recommend from "@/components/home/recommend/Recommend";
import Ranking from "@/components/home/ranking/Ranking";
import Singer from "@/components/home/singer/Singer";
import VideoList from "@/components/home/video/VideoList";
import SwipeGuard from "@/components/common/SwipeGuard";
import { playlistMixin } from "@/assets/common/js/mixin.js";
import { mapWritableState } from "pinia";

import { useAppStore } from "@/stores";
export default {
  mixins: [playlistMixin],
  computed: {
    ...mapWritableState(useAppStore, ["oldVideo", "homeCurrentIndex"]),
    currentIndex: {
      get() {
        return this.homeCurrentIndex;
      },
      set(index) {
        this.homeCurrentIndex = index;
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
    SwipeGuard,
  },
};
</script>
