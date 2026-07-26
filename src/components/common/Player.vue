<template>
  <div class="play-container"
       ref="play"
       v-show="playList.length > 0">
    <!-- 全屏播放器 -->
    <FullScreenPlay ref="FullScreenPlay"
                    v-show="playerFullScreen"
                    @prev="prev"></FullScreenPlay>

    <!-- 迷你播放器 -->
    <mini-play v-show="!hideMiniPlayer"></mini-play>

    <!-- 音频组件 -->
    <div class="audio">
      <audio ref="audio"
             id="audio"
             :playbackRate="songSpeed"
             preload="auto"
             @canplay="ready"
             @error="error"
             @timeupdate="handleUpdateTime"
             @ended="handleEnd"
             :src="url"></audio>
    </div>

    <!-- 歌曲列表 -->
    <play-list @close="togglePlayList"></play-list>

    <!-- 播放速度 -->
    <song-speed></song-speed>
  </div>
</template>

<script>
import songApi from "@/api/song.js";
import singerApi from "@/api/singer.js";
import { ERR_OK } from "@/api/config.js";
import FullScreenPlay from "./play/FullScreenPlay";
import MiniPlay from "./play/MiniPlay";
import PlayList from "@/components/home/playList/PlayList";
import SongSpeed from "./play/SongSpeed";
import { PLAY_MODE } from "@/assets/common/js/config.js";
import { mapWritableState, mapState, mapActions } from 'pinia'

import { usePlayerStore, useAppStore } from '@/stores'
export default {
  data () {
    return {
      url: "", // 播放路径
      playerParams: {
        // 播放器参数
        currentTime: 0,
        duration: 0,
        width: 0,
      },
    };
  },
  provide () {
    return {
      playerParams: this.playerParams,
    };
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id || newSong.id === oldSong.id) return;
      if (this.currentLyric) {
        this.currentLyric.stop();
        this.audio.currentTime = 0;
        this.currentLyric = null;
        this.currentPlayLyric = "";
        this.currentLineNum = 0;
      }
      this.playing = false;
      this.getSong(this.currentSong);
      this.scrobble(this.currentSong.id, this.currentSong.album.id);
      this.isLoadPlayerImage = true;
    },
    playing (newPlaying) {
      const audio = this.audio;
      clearInterval(this.t1);
      clearInterval(this.t2);
      if (newPlaying) {
        this.$nextTick(() => {
          audio.play().catch(() => { });
          let v = 0;
          audio.volume = 0;
          this.t1 = setInterval(() => {
            v += 0.1;
            if (v <= 1) audio.volume = v;
            if (v >= 1) clearInterval(this.t1);
          }, 50);
        });
      } else {
        this.$nextTick(() => {
          let v = audio.volume;
          clearInterval(this.t2);
          this.t2 = setInterval(() => {
            v -= 0.1;
            if (v >= 0) audio.volume = v;
            if (v <= 0) {
              audio.pause();
              audio.volume = 0;
              clearInterval(this.t2);
            }
          }, 50);
        });
      }
    },
    togglePlayList () {
      this.togglePlayList ? this.closeScroll() : this.openScroll();
    },
    songSpeed () {
      this.applyPlaybackRate();
    },
    playerFullScreen () {
      //关闭播放器页面则关闭歌词页面
      if (this.playerFullScreen === false) {
        // 等待关闭动画结束后再切换到图片状态
        setTimeout(() => {
          this.playerShowImage = true;
        }, 400); // fadeOut动画的持续时间是400ms
      }
    },
  },
  unmounted () {
    // 清理定时器，防止内存泄漏
    clearInterval(this.t1);
    clearInterval(this.t2);
    this.t1 = null;
    this.t2 = null;
  },
  computed: {
    ...mapWritableState(usePlayerStore, ['playerFullScreen', 'songReady', 'playing', 'currentPlayIndex', 'playList', 'playMode', 'sequenceList', 'currentLyric', 'isPlay', 'hideMiniPlayer', 'songLoading', 'songSpeed', 'songSpeedPopup', 'togglePlayList']),
    ...mapWritableState(useAppStore, ['audio']),
    ...mapState(usePlayerStore, ['currentSong']),

  },
  mounted () {
    this.audio = this.$refs.audio;
  },
  methods: {
    ...mapActions(usePlayerStore, ['deleteSong', 'loop', 'next', 'prev', 'handleTogglePlaying']),
    // 统一应用播放速度
    applyPlaybackRate () {
      if (this.audio) {
        this.$nextTick(() => {
          this.audio.playbackRate = this.songSpeed;
        });
      }
    },
    ready () {
      this.playerParams.duration = audio.duration;
      this.songReady = true;
    },
    error () {
      this.songReady = true;
    },
    async getSong (song) {
      this.songLoading = true;
      this.playerParams.width = 0;
      try {
        const { data: res } = await songApi.getMusicUrl(song.id);
        console.log(res);
        if (res.code !== ERR_OK) throw new Error("获取音乐播放路径失败");
        const url = res.data[0].url;
        if (!url) {
          song.st = -1;
          this.deleteSong(song);
          this.songReady = true;
          this.$toast("该歌曲暂时不能播放");
          return;
        }
        this.url = url;
        if (!song.album.picUrl) {
          const { data: albumData } = await singerApi.getAlbumInfo(song.album.id);
          song.album.picUrl = albumData.album.picUrl;
        }
        this.$nextTick(async () => {
          await this.$refs.FullScreenPlay.$refs.playSection.getLyric(this.currentSong.id);
        });
        if (this.currentLyric) this.currentLyric.play();
        this.playing = true;
      } catch (error) {
        this.$toast("获取歌曲失败");
      } finally {
        this.songLoading = false;
        this.applyPlaybackRate();
      }
    },
    handleUpdateTime (e) {
      this.playerParams.currentTime = e.target.currentTime;
      this.playerParams.width =
        (this.playerParams.currentTime / this.playerParams.duration) * 100;
    },
    handleEnd () {
      this.playMode === PLAY_MODE.loop ? this.loop() : this.next();
    },
    changeMode () {
      const mode = (this.playMode + 1) % 3;
      this.playMode = mode;
      const list =
        mode === PLAY_MODE.random
          ? this.$utils.randomList(this.sequenceList)
          : this.sequenceList;
      this.resetCurrentIndex(list);
      this.playList = list;
      this.$toast(["列表循环", "单曲循环", "随机播放"][mode]);
    },
    scrobble (id, sourceId) {
      songApi.scrobble(id, sourceId);
    },
    resetCurrentIndex (list) {
      const index = list.findIndex((item) => item.id === this.currentSong.id);
      this.currentPlayIndex = index;
    },
    closeScroll () {
      document.body.style.overflow = "hidden";
    },
    openScroll () {
      document.body.style.overflow = "";
    },
  },
  components: {
    FullScreenPlay,
    MiniPlay,
    PlayList,
    SongSpeed,
  },
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.play-container :deep(.singerList){
  max-height: 6rem;
}
</style>
