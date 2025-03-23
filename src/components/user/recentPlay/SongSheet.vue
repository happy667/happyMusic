<template>
  <div class="recent-songSheet-container">
    <!-- loading -->
    <loading :loading="loading" />
    <template v-if="songSheetList.length!==0">
      <song-sheet-list :list="songSheetList"></song-sheet-list>
    </template>
    <template v-if="!loading&&total===0">
      <no-result text="暂无最近播放歌单"></no-result>
    </template>
  </div>
</template>
<script>
import SongSheetList from '@/components/home/songSheet/SongSheetList'
import NoResult from '@/components/common/NoResult'
import userApi from '@/api/user.js'
import { ERR_OK } from '@/api/config.js'

export default {
  name: 'RencentPlaySongSheet',
  data () {
    return {
      songSheetList: [], // 歌单列表
      loading: false,    // 加载状态
      total: 0          // 歌单总数
    };
  },
  mounted () {
    this.getRencentPlaySongSheet();
  },
  methods: {
    // 查询歌单
    async getRencentPlaySongSheet () {
      this.loading = true; // 开始加载
      try {
        const { data: res } = await userApi.getUserRencent('playlist');
        if (res.code === ERR_OK) {
          // 处理歌单数据
          const songSheetList = res.data.list.map(item => item.data);
          this.songSheetList = songSheetList;
          this.total = res.data.total;
          this.$emit('songSheetCount', this.songSheetList.length); // 触发事件
        }
      } catch (error) {
        console.error('获取歌单失败:', error);
      } finally {
        this.loading = false; // 结束加载
      }
    },
  },
  components: {
    SongSheetList,
    NoResult,
  },
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recent-songSheet-container {
  padding-top: 0.25rem;
  box-sizing: border-box;

  .songSheet-list-null {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    color: $color-common-b;
    font-size: $font-size-smaller;
    text-align: center;
  }
}
</style>