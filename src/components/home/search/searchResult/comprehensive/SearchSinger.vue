<template>
  <div class="search"
       v-if="singer&&singer.singerList.length!==0">
    <div class="search-singer">
      <AppTitle title="歌手"></AppTitle>
      <singer-list :list="singer.singerList"
                   imageSize="middle"
                   @select="selectSinger"></singer-list>
      <div class="more"
           v-if="singer.moreText"
           @click="$emit('setIndex',2)">
        <div class="text">
          {{singer.moreText}}
        </div>
        <div class="icon">
          <van-icon name="arrow" />
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import AppTitle from '@/components/common/Title'
import SingerList from '@/components/common/singer_desc/SingerList'
import { mapWritableState, mapActions } from 'pinia'

import { useSingerStore } from '@/stores'
export default {
  computed: {
    ...mapWritableState(useSingerStore, ['singerCurrentIndex']),
  },
  props: {
    singer: Object
  },
  methods: {
    // 选择歌手
    selectSinger (item) {
      this.singerCurrentIndex = 0
      this.$router.push(`/singerInfo/${item.id}`)
    }
  },
  components: {
    SingerList,
    AppTitle
  }
}
</script>