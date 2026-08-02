<template>
  <div class="function-container anim-fade-in">
    <!-- 倍速播放 -->
    <div class="song-speed icon" @click="handleSongSpeedClick">
      <i class="iconfont icon-speed"></i>
    </div>
    <!-- 关注 -->
    <div class="love icon" @click="selectItemLove">
      <i class="iconfont" :class="loveIcon"></i>
    </div>
    <!-- 视频 -->
    <div class="video icon" v-if="currentSong.mv" @click="handleVideoClick">
      <van-icon name="tv-o" />
    </div>
    <!-- 评论 -->
    <div class="comment icon" @click="handleCommentClick">
      <van-icon name="more-o" />
    </div>
  </div>
</template>
<script>
import userApi from "@/api/user.js";
import { ERR_OK } from "@/api/config.js";
import { mapWritableState, mapState, mapActions } from "pinia";

import { useUserStore, usePlayerStore, useAppStore } from "@/stores";
export default {
  computed: {
    ...mapWritableState(useUserStore, ["user"]),
    ...mapWritableState(usePlayerStore, [
      "isPlayerClick",
      "playerFullScreen",
      "songSpeedPopup",
      "togglePlayList",
    ]),
    ...mapWritableState(useAppStore, ["noCacheComponents"]),
    ...mapState(usePlayerStore, ["currentSong"]),
    loveIcon() {
      return this.currentSong.isLike ? "icon-aixin" : "icon-icon-test";
    },
  },
  methods: {
    ...mapActions(useAppStore, ["addNoCacheComponent", "removeNoCacheComponent"]),
    // 点击评论
    handleCommentClick() {
      // 设置从播放器页面点击
      this.isPlayerClick = true;
      // 添加不缓存路由
      this.addNoCacheComponent("songComment");
      this.playerFullScreen = false;
      if (this.$route.path !== `/songComment/${this.currentSong.id}`) {
        this.$router.push(`/songComment/${this.currentSong.id}`);
      }
    },
    // 点击tv
    handleVideoClick() {
      // 设置从播放器页面点击
      this.isPlayerClick = true;
      // 添加不缓存路由
      this.addNoCacheComponent("videoInfo");
      this.playerFullScreen = false;
      if (this.$route.path !== `/videoInfo/${this.currentSong.mv}`) {
        this.$router.push(`/videoInfo/${this.currentSong.mv}`);
      }
    },
    // 选中歌曲喜欢
    selectItemLove() {
      // 判断是否登录
      if (!this.user) {
        // 弹窗提示去登录
        this.$utils.alertLogin(this.$route.fullPath);
      } else {
        // 添加或取消喜欢音乐
        this.likeMusic(this.currentSong);
      }
    },
    // 喜欢音乐
    likeMusic(song) {
      let like = !song.isLike;
      userApi
        .likeMusic(song.id, like)
        .then((res) => {
          if (res.data.code === ERR_OK) {
            console.log(like);
            // 同步喜欢状态
            this.currentSong.isLike = like;
          } else {
            this.$toast(res.data.message);
          }
        })
        .catch((err) => {
          this.$toast(err.data.message);
        });
    },
    handleSongSpeedClick() {
      this.songSpeedPopup = true;
    },
  },
};
</script>
<style lang="stylus" scoped>

.function-container {
  display: flex;
  justify-content: space-evenly;
  height: 1.45rem;

  .icon {
    i {
      color: #fff;
      font-size: 0.7rem;
    }

    .icon-aixin {
      color: $color-common;
    }
  }

  .van-info {
    background-color: $color-common;
  }
}
</style>
