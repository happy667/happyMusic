<template>
  <div class="album-container">
    <!-- loading -->
    <loading :loading="loading" />
    <template v-if="albumList.length!==0">
      <div class="album-list">
        <album-list :list="albumList"
                    @select="selectAlbum"></album-list>
      </div>
    </template>
    <template v-if="!loading&&total===0">
      <no-result text="暂无最近播放专辑"></no-result>
    </template>
  </div>
</template>
<script>
import AlbumList from '@/components/common/album/AlbumList'
import NoResult from '@/components/common/NoResult'
import userApi from '@/api/user.js'
import Album from '@/assets/common/js/album.js'
import { ERR_OK } from '@/api/config.js'

export default {
  name: 'RecentPlayAlbum',
  data () {
    return {
      albumList: [], // 专辑列表
      loading: false, // 加载状态
      total: 0 // 专辑总数
    };
  },
  mounted () {
    this.getAlbums();
  },
  methods: {
    // 查询专辑
    async getAlbums () {
      this.loading = true; // 开始加载
      try {
        const { data: res } = await userApi.getUserRencent('album');
        if (res.code === ERR_OK) {
          // 处理专辑数据
          const albumList = res.data.list.map(item => {
            const albumData = item.data;
            return new Album({
              id: albumData.id,
              name: albumData.alias.length > 0
                ? `${albumData.name} (${albumData.alias.join('/')})`
                : albumData.name,
              picUrl: albumData.picUrl,
              singerName: albumData.artists.map(artist => artist.name).join('/'),
              publishTime: albumData.publishTime,
            });
          });
          this.albumList = albumList;
          this.total = res.data.total;
          this.$emit('albumCount', this.albumList.length); // 触发事件
        }
      } catch (error) {
        console.error('获取专辑失败:', error);
      } finally {
        this.loading = false; // 结束加载
      }
    },
    // 选择专辑
    selectAlbum (item) {
      this.$router.push(`/singerAlbum/${item.id}`);
    },
  },
  components: {
    NoResult,
    AlbumList,
  },
};
</script>
<style lang="stylus" scoped>
.album-container {
  padding: 0 0.4rem;
}
</style>