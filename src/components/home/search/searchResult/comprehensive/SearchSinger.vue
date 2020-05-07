<template>
  <div class="search"
       v-if="singer&&singer.singerList.length!==0">
    <div class="search-singer">
      <Title title="歌手"></Title>
      <singer-list :list="singer.singerList"
                   @select="selectSinger"></singer-list>
      <div class="more"
           v-if="singer.moreText"
           @click="$emit('setIndex',2)"
           v-fb>
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
import Title from '@/components/common/Title'
import SingerList from '@/components/common/singer_desc/SingerList'
import { mapMutations } from 'vuex'
export default {
  props: {
    singer: Object
  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex']),
    // 选择歌手
    selectSinger (item) {
      this.setSingerCurrentIndex(0)
      this.$router.push(`/singerInfo/${item.id}`)
    }
  },
  components: {
    SingerList,
    Title
  }
}
</script>