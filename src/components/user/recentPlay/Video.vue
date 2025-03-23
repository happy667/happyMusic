<template>
  <div class="recent-video-container">
    <!-- loading -->
    <loading :loading="loading" />
    <template v-if="mvList.length!==0">
      <div class="mv-list">
        <mv-list @select="goToVideoInfo"
                 :list="mvList"></mv-list>
      </div>
    </template>
    <template v-if="!loading&&total===0">
      <no-result text="暂无最近播放MV"></no-result>
    </template>
  </div>
</template>
<script>
import MvList from '@/components/common/video/VideoList'
import NoResult from '@/components/common/NoResult'
import userApi from '@/api/user.js'
import Video from '@/assets/common/js/video.js'
import { ERR_OK } from '@/api/config.js'

export default {
  name: 'RecentPlayVideo',
  data () {
    return {
      mvList: [], // MV 列表
      loading: false, // 加载状态
      total: 0 // MV 总数
    };
  },
  mounted () {
    this.getMV();
  },
  methods: {
    // 查询 MV
    async getMV () {
      this.loading = true; // 开始加载
      try {
        const { data: res } = await userApi.getUserRencent('video');
        if (res.code === ERR_OK) {
          // 处理 MV 数据
          const videoList = res.data.list
            .map(item => item.data)
            .filter(item => item.artists) // 过滤掉没有艺术家的 MV
            .map(item => new Video({
              id: item.id,
              coverUrl: item.coverUrl,
              name: item.name,
              playCount: item.playCount,
              duration: item.duration,
              creatorName: item.artists.map(artist => artist.name).join('/'),
            }));
          this.mvList = videoList;
          this.total = res.data.total;
          this.$emit('videoCount', this.mvList.length); // 触发事件
        }
      } catch (error) {
        console.error('获取 MV 失败:', error);
      } finally {
        this.loading = false; // 结束加载
      }
    },
    // 跳转到 MV 详情页
    goToVideoInfo (mv) {
      this.$router.push(`/videoInfo/${mv.id}`);
    },
  },
  components: {
    MvList,
    NoResult,
  },
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recent-video-container {
  padding: 0.25rem 0.4rem 0;
  box-sizing: border-box;
}
</style>