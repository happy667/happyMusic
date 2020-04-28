<template>
  <div class="search"
       v-if="album&&album.length!==0">
    <div class="search-album">
      <album-list :list="album.albumList"
                  @select="selectAlbum">
        <template>
          <Title title="专辑"></Title>
        </template>
      </album-list>
      <div class="more"
           v-if="album.moreText"
           @click="$emit('setIndex',3)">
        <div class="text">
          {{album.moreText}}
        </div>
        <div class="icon">
          <van-icon name="arrow" />
        </div>

      </div>
    </div>
  </div>
</template>
<script>

import Title from '@/components/common/Title'
import AlbumList from '@/components/common/album/AlbumList'
export default {
  props: {
    album: Object
  },
  methods: {
    // 选择专辑
    selectAlbum (item) {
      this.$router.push(`/singerAlbum/${item.id}`)
    }
  },
  components: {
    AlbumList,
    Title
  }
}
</script>