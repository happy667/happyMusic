<template>
  <div class="recent-song-container">
    <!-- loading -->
    <loading :loading="loading" />
    <template v-if="songList.length!==0">
      <play-all :length="songList.length"
                @play="handlePlayAll(songList)"></play-all>
      <song-list @select="selectSong"
                 :showImage="true"
                 ref="songList"
                 :songsList="songList"></song-list>
    </template>

    <template v-if="!loading&&total===0">
      <no-result text="暂无最近播放歌曲"></no-result>
    </template>
  </div>
</template>
<script>
import PlayAll from '@/components/common/PlayAll'
import SongList from '@/components/home/song/SongList'
import NoResult from '@/components/common/NoResult'
import userApi from '@/api/user.js'
import { ERR_OK } from '@/api/config.js'
import { mapGetters, mapMutations } from 'vuex'
import Song from '@/assets/common/js/song.js'
import Album from '@/assets/common/js/album.js'
import Singer from '@/assets/common/js/singer.js'

export default {
  name: 'RecentPlaySong',
  data () {
    return {
      songList: [], // 歌曲列表
      loading: false, // 加载状态
      total: 0 // 歌曲总数
    };
  },
  computed: {
    ...mapGetters(['currentSong']), // 从 Vuex 获取当前播放的歌曲
  },
  mounted () {
    this.getSongs();
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen']), // 映射 Vuex 的 mutations
    // 播放全部歌曲
    handlePlayAll (list) {
      this.$utils.playAllSong(list); // 调用工具方法播放全部歌曲
    },
    // 查询单曲
    async getSongs () {
      this.loading = true; // 开始加载
      try {
        const { data: res } = await userApi.getUserRencent('song');
        if (res.code === ERR_OK) {
          // 处理歌曲数据
          const songList = res.data.list.map(item => {
            const songData = item.data;
            const singers = songData.ar.map(artist => artist.name).join('/');
            const singersList = songData.ar.map(artist => new Singer({
              id: artist.id,
              name: artist.name,
              avatar: artist.img1v1Url,
              picUrl: artist.picUrl,
            }));
            return new Song({
              id: songData.id,
              name: songData.name,
              singers,
              singersList,
              mv: songData.mv,
              picUrl: songData.al.picUrl,
              album: new Album({
                id: songData.al.id,
                name: songData.al.name,
                picUrl: songData.al.picUrl,
              }),
            });
          });
          this.songList = songList;
          this.total = res.data.total;
          this.$emit('songCount', this.songList.length); // 触发事件
        }
      } catch (error) {
        console.error('获取歌曲失败:', error);
      } finally {
        this.loading = false; // 结束加载
      }
    },
    // 选择歌曲
    async selectSong (item, index) {
      this.$emit('closeList');
      // 比较当前播放的歌曲和点击的歌曲
      const result = this.$utils.compareSong(this.currentSong, item);
      if (!result) {
        this.$utils.playMusic(item, this.songList, index); // 播放歌曲
      }
    },
  },
  components: {
    SongList,
    NoResult,
    PlayAll,
  },
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recent-song-container {
  padding-top: 0.2rem;

  .song-list-null {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    color: $color-common-b;
    font-size: $font-size-smaller;
    text-align: center;
  }
}
</style>