<template>
  <div class="search"
       v-if="album && album.length !== 0">
    <div class="search-album">
      <album-list :list="album.albumList"
                  @select="selectAlbum">
        <AppTitle title="专辑"></AppTitle>
      </album-list>
      <div class="more"
           v-if="album.moreText"
           @click="$emit('setIndex', 3)">
        <div class="text">
          {{ album.moreText }}
        </div>
        <div class="icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppTitle from "@/components/common/Title";
import AlbumList from "@/components/common/album/AlbumList";
export default {
  props: {
    album: Object,
  },
  methods: {
    // 选择专辑
    selectAlbum (item) {
      this.$router.push(`/singerAlbum/${item.id}`);
    },
  },
  components: {
    AlbumList,
    AppTitle,
  },
};
</script>
<style lang="stylus" scoped>
.search-album :deep(.album-list-container .album-container .image-container){
  width: 1.5rem;
  height: 1.5rem;
}
</style>
