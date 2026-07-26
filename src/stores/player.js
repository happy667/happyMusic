import { defineStore } from 'pinia'
import { PLAY_MODE } from '@/assets/common/js/config.js'
import utils from '@/assets/common/js/utils.js'
import { showToast } from 'vant'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    playing: false, playList: [], playerFullScreen: false, sequenceList: [],
    playMode: PLAY_MODE.sequence, currentPlayIndex: -1, togglePlayList: false,
    songReady: false, playerShowImage: true, currentLyric: null, currentLineNum: 0,
    currentPlayLyric: '', hideMiniPlayer: false, isPlayerClick: false,
    songLoading: false, songSpeed: 1, songSpeedPopup: false
  }),
  getters: { currentSong: (state) => state.playList[state.currentPlayIndex] || {} },
  actions: {
    prev () {
      if (!this.songReady) return; if (this.playList.length === 1) return this.loop();
      this.currentPlayIndex = utils.limitCutIndex(this.currentPlayIndex, this.playList.length - 1);
      if (!this.playing) this.handleTogglePlaying(); this.songReady = false;
      utils.playMusic(this.currentSong, null, this.currentPlayIndex);
    },
    handleTogglePlaying () {
      if (!this.songReady || this.songLoading) return;
      this.playing = !this.playing; if (this.currentLyric) this.currentLyric.togglePlay();
    },
    next () {
      if (!this.songReady) return; if (this.playList.length === 1) return this.loop();
      this.currentPlayIndex = utils.limitAddIndex(this.currentPlayIndex, this.playList.length);
      if (!this.playing) this.handleTogglePlaying(); this.songReady = false;
      utils.playMusic(this.currentSong, null, this.currentPlayIndex);
    },
    loop () {
      const audio = this.audio; if (audio) audio.currentTime = 0;
      if (this.currentLyric) this.currentLyric.seek(0);
      this.playing = true; if (audio) audio.play().catch(() => { });
    },
    setSelectPlay ({ list, index }) { this.playing = true; this.sequenceList = list; this.currentPlayIndex = index; this.playList = list; },
    deleteSongList () { this.playing = false; this.playList = []; this.sequenceList = []; this.currentPlayIndex = -1; this.playerFullScreen = false; },
    deleteSong (song) {
      const { findIndex } = utils;
      let playlist = this.playList.slice(), sequenceList = this.sequenceList.slice();
      let pIndex = findIndex(playlist, song), sIndex = findIndex(sequenceList, song), ci = this.currentPlayIndex;
      playlist.splice(pIndex, 1); sequenceList.splice(sIndex, 1);
      if (pIndex < ci) this.currentPlayIndex = ci - 1;
      else if (playlist.length && ci === playlist.length) { ci = 0; this.currentPlayIndex = ci; }
      this.playList = playlist; this.sequenceList = sequenceList;
      if (!playlist.length) { this.playing = false; this.playerFullScreen = false; } else this.playing = true;
    },
    changeMode () {
      const mode = (this.playMode + 1) % 3; this.playMode = mode;
      const list = mode === PLAY_MODE.random ? utils.randomList(this.sequenceList) : this.sequenceList;
      this.currentPlayIndex = list.findIndex(item => item.id === this.currentSong.id); this.playList = list;
      showToast(['列表循环', '单曲循环', '随机播放'][mode]);
    }
  }
})