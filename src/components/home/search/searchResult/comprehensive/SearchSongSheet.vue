<template>
  <div class="search"
       v-if="songSheet&&songSheet.songSheetList.length!==0">
    <div class="search-songSheet">
      <song-sheet-list :list="songSheet.songSheetList">
        <template>
          <Title title="歌单"></Title>
        </template>
      </song-sheet-list>
      <div class="more"
           v-if="songSheet.moreText"
           @click="$emit('setIndex',4)"
           v-fb>
        <div class="text">
          {{songSheet.moreText}}
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
import SongSheetList from '@/components/home/songSheet/SongSheetList'
export default {
  props: {
    songSheet: Object
  },
  components: {
    SongSheetList,
    Title
  }
}
</script>