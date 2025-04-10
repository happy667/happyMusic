<template>
  <div class="my-like-container"
       @touchstart="handleTouchStart"
       @touchmove="handleTouchMove"
       @touchend="handleTouchEnd">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title"
                   ref="navBar"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>

    <section>
      <scroll ref="my_like_scroll">
        <div class="container"
             ref="container">
          <!-- loading -->
          <loading :loading="pageLoading" />
          <template v-if="songList&&songList.length!==0">
            <play-all :length="songList.length"
                      :showFilter="true"
                      :filterStatus="filterStatus"
                      @filterClick="handleFilterClickBtn"
                      @play="handlePlayAll(songList)"></play-all>
            <song-list @select="selectSong"
                       :showImage="true"
                       :showMV="false"
                       ref="songList"
                       :songsList="songList"></song-list>
          </template>

          <template v-if="!pageLoading&&songList.length===0">
            <play-all :length="songList.length"
                      :showFilter="true"
                      :filterStatus="filterStatus"
                      @filterClick="handleFilterClickBtn"
                      @play="handlePlayAll(songList)"></play-all>
            <no-result text="暂无收藏的歌曲"></no-result>
          </template>

        </div>
      </scroll>
      <!-- 时间筛选 -->
      <time-filter ref="timeFilter"
                   v-if="user"
                   :maxDate="new Date()"
                   :minDate="new Date(this.user.createTime)"
                   :filterCondition="filterCondition"
                   :showTimeFilter.sync="showTimeFilterPopup"
                   @filterChange="handleFilterChange" />
      <!-- 定位 -->
      <position v-show="isShowPosition"
                @click="handlePosition"></position>
    </section>
  </div>
</template>
<script>
import PlayAll from '@/components/common/PlayAll'
import Scroll from '@/components/common/Scroll'
import Position from '@/components/common/Position'
import SongList from '@/components/home/song/SongList'
import TimeFilter from '@/components/common/TimeFilter.vue'
import Singer from '@/assets/common/js/singer.js'
import Song from '@/assets/common/js/song.js'
import NoResult from '@/components/common/NoResult'
import Album from '@/assets/common/js/album.js'
import recommendApi from '@/api/recommend.js'
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  mapState,
  mapActions,
  mapGetters
} from 'vuex'
import {
  playlistMixin
} from '@/assets/common/js/mixin.js'
export default {
  name: 'myLike',
  data () {
    return {
      songList: null, // 歌曲列表
      originalSongList: null, // 歌曲列表(过滤)
      filterStatus: false, // 筛选状态
      loading: true,
      showPosition: false,
      filterCondition: {
        startTime: null,
        endTime: null,
        minPlayCount: null,
        maxPlayCount: null
      },
      showTimeFilterPopup: false, // 是否显示时间筛选
    }
  },
  mixins: [playlistMixin],
  provide () {
    return {
      showPlayCount: true
    }
  },
  computed: {
    ...mapState(['user', 'currentPlayIndex']),
    ...mapGetters(['currentSong']),
    // 是否显示定位
    isShowPosition () {
      if (!this.songList) return
      // 判断当前歌曲列表是否有正在播放的歌曲（-1表示没有)
      let index = this.$utils.findIndex(this.songList, this.currentSong)
      return this.showPosition && index !== -1
    },
    pageLoading () {
      return !this.songList
    }
  },
  methods: {
    ...mapActions(['getUserLikeList']),
    // 返回上一个路由
    routerBack () {
      this.$utils.routerBack()
    },
    // 获取歌曲列表
    async getSongList () {
      try {
        // 获取用户收藏的歌单
        const { data: playlistRes } = await userApi.getUserSongSheet(this.user.userId);
        if (playlistRes.code !== ERR_OK) {
          throw new Error(playlistRes.message || '获取歌单失败');
        }
        // 查找用户创建的歌单ID
        const userPlaylist = playlistRes.playlist.find(
          item => item.creator.userId === this.user.userId
        );
        if (!userPlaylist) {
          throw new Error('未找到用户歌单');
        }
        // 获取歌单详情
        const { data: detailRes } = await recommendApi.getSongSheetById(userPlaylist.id);
        if (detailRes.code !== ERR_OK) {
          throw new Error(detailRes.message || '获取歌单详情失败');
        }
        const { playlist } = detailRes;
        // 创建trackId到收藏时间的映射
        const trackTimeMap = playlist.trackIds.reduce((map, track) => {
          map[track.id] = track.at; // 使用at字段作为收藏时间
          return map;
        }, {});
        // 处理歌曲列表
        this.originalSongList = playlist.tracks.map(item => {
          const singerName = item.ar.map(artist => artist.name).join('/');
          const singersList = item.ar.map(artist => new Singer({
            id: artist.id,
            name: artist.name,
            aliaName: artist.alias.join(' / '),
            avatar: artist.img1v1Url,
            picUrl: artist.picUrl
          }));

          return new Song({
            id: item.id,
            name: item.name,
            singers: singerName,
            singersList,
            picUrl: item.al.picUrl,
            album: new Album({
              id: item.al.id,
              name: item.al.name,
              picUrl: item.al.picUrl
            }),
            mv: item.mv,
            followTime: trackTimeMap[item.id] // 添加收藏时间字段
          });
        });

        // 获取听歌排行数据并合并播放次数
        await this.getUserPlayRecord();

        this.songList = this.originalSongList;
      } catch (error) {
        console.error('获取歌曲列表出错:', error);
        this.$toast(error.message || '获取歌曲列表失败');
        this.$router.replace('/');
      }
    },
    // 获取用户听歌排行
    async getUserPlayRecord () {
      try {
        // 获取所有时间的听歌排行
        const { data: res } = await userApi.getUserPlayRecord(this.user.userId, 0);
        if (res.code === ERR_OK) {
          // 创建播放次数映射
          const playCountMap = {};
          res.allData.forEach(item => {
            playCountMap[item.song.id] = item.playCount;
          });

          // 更新歌曲列表中的播放次数
          this.originalSongList = this.originalSongList.map(song => {
            if (playCountMap[song.id]) {
              song.playCount = playCountMap[song.id];
            }
            return song;
          });

          // 如果当前处于筛选状态，重新应用筛选条件
          if (this.filterStatus) {
            this.songList = this.filterSong(this.originalSongList);
          }
        }
      } catch (error) {
        console.error('获取听歌排行失败:', error);
      }
    },
    handlePosition () {
      // 说明有歌曲在播放
      if (this.currentSong) {
        let index = this.songList.findIndex(item => item.id === this.currentSong.id)
        let element = this.$refs.songList.$refs.listGroup[index]
        this.$refs.my_like_scroll.scrollToElement(element, 0)
        this.$refs.my_like_scroll.refresh()
        this.$toast('已定位到当前歌曲')
      }
    },
    handleTouchStart () {
      clearTimeout(this.timer)
    },
    handleTouchMove () {
      this.showPosition = true
    },
    handleTouchEnd () {
      this.timer = setTimeout(() => {
        this.showPosition = false
      }, 5000)
    },
    handlePlaylist (playList) {
      // 适配播放器与页面底部距离
      const bottom = playList.length > 0 ? '1.5rem' : ''
      this.$nextTick(() => {
        this.$refs.container.style.paddingBottom = bottom
        this.$refs.my_like_scroll.refresh()
      })
    },
    // 选择歌曲
    async selectSong (item, index) {
      this.$emit('closeList')
      // 比较两首歌曲
      let result = this.$utils.compareSong(this.currentSong, item)
      if (!result) {
        // 引入vue原型上的utils
        this.$utils.playMusic(item, this.songList, index)
      }
    },
    // 播放全部歌曲
    handlePlayAll (list) {
      // 引入vue原型上的utils
      this.$utils.playAllSong(list)
    },
    //当筛选时间变化时
    handleFilterChange (condition) {
      // 确保播放次数数据正确传递
      this.filterCondition = {
        startTime: condition.startTime,
        endTime: condition.endTime,
        minPlayCount: condition.minPlayCount,
        maxPlayCount: condition.maxPlayCount
      }
      //筛选歌曲
      this.songList = this.filterSong(this.originalSongList)
      this.filterStatus = true
      this.showTimeFilterPopup = false
      this.$toast("筛选成功")
    },
    /**
   * 处理筛选按钮点击事件
   * 控制时间筛选弹窗的显示/隐藏，并根据筛选状态更新歌曲列表
   */
    handleFilterClickBtn () {
      // 如果当前已经是筛选状态，则关闭弹窗并取消筛选
      if (this.filterStatus) {
        this.filterStatus = false;       // 取消筛选状态
        this.songList = this.originalSongList; // 恢复显示原始歌曲列表
        this.showTimeFilterPopup = true; // 显示时间筛选弹窗
        return;
      }

      // 如果不是筛选状态，则切换时间筛选弹窗的显示状态
      this.showTimeFilterPopup = !this.showTimeFilterPopup;

      // 如果关闭弹窗且没有应用筛选条件，保持当前列表不变
      if (!this.showTimeFilterPopup && !this.filterStatus) {
        this.songList = this.originalSongList;
      }
      //清空筛选条件
      this.filterCondition = {
        startTime: null,
        endTime: null,
        minPlayCount: null,
        maxPlayCount: null
      }
    },
    //筛选歌曲
    filterSong (list) {
      let { startTime, endTime, minPlayCount, maxPlayCount } = this.filterCondition;
      let filterList = list.filter(item => {
        let timestamp = item.followTime;
        let timeMatch = true;
        let playCountMatch = true;

        // 时间筛选
        if (startTime && endTime) {
          timeMatch = timestamp >= startTime && timestamp <= endTime;
        }

        // 播放次数筛选
        if (minPlayCount !== null && maxPlayCount !== null) {
          playCountMatch = item.playCount >= minPlayCount && item.playCount <= maxPlayCount;
        } else if (minPlayCount !== null) {
          playCountMatch = item.playCount >= minPlayCount;
        } else if (maxPlayCount !== null) {
          playCountMatch = playCountMatch && item.playCount <= maxPlayCount;
        }
        return timeMatch && playCountMatch;
      });
      return filterList;
    }
  },
  mounted () {
    if (this.user) {
      this.getSongList()
    }
  },
  watch: {
    user () {
      if (this.user && !this.songList) {
        this.getSongList()
      }
    }
  },
  components: {
    SongList,
    Position,
    Scroll,
    NoResult,
    PlayAll,
    TimeFilter
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.my-like-container>>>.scroll {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.my-like-container {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $color-common-background;

  section {
    position: relative;
    flex: 1;

    .container {
      padding-top: 0.3rem;
    }
  }
}
</style>