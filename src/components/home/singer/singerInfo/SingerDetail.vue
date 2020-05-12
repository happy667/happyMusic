<template>
  <article class="singer-detail-container">
    <!-- loading -->
    <loading :loading="loading" />
    <!-- 歌手简介 -->
    <template v-if="!loading">
      <template v-if="!singerDetail.briefDesc">
        <no-result text="暂无歌手简介"></no-result>
      </template>
      <template v-else>
        <div class="singer-synopsis-container">
          <div class="title">
            <Title title="歌手简介"
                   loadMore
                   :path="`/singerIntroduce/${singerDetail.singerId}`"
                   @click="handleClickTitle"></Title>
          </div>
          <div class="singer-synopsis">
            <article class="context">
              {{singerDetail.briefDesc}}
            </article>
          </div>
        </div>
        <div class="sim-singer-container"
             v-if="simSingerList.length!==0">
          <div class="title">
            <Title title="相似歌手"></Title>
          </div>
          <div class="sim-singer-list-container">
            <singer-swiper-list :list="simSingerList"
                                @selectItem="selectItem" />
          </div>
        </div>

      </template>
    </template>
  </article>

</template>
<script>
import NoResult from '@/components/common/NoResult'
import Title from '@/components/common/Title'
import SingerSwiperList from '@/components/common/singerSwiper/SingerList'
import { mapMutations } from 'vuex'
export default {
  props: {
    singerDetail: {
      type: Object,
      default: () => { }
    },
    simSingerList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    loading () {
      return !this.singerDetail
    }
  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex']),
    handleClickTitle () {
      this.$emit('goToIntroduce')
    },
    selectItem (item) {
      this.$emit('selectSimSinger', item)
    }
  },
  components: {
    NoResult,
    Title,
    SingerSwiperList
  }
}
</script>
<style lang="stylus" scoped>
.singer-detail-container {
  @import '~common/stylus/variable';

  .context {
    margin: 0.4rem 0;
    line-height: 0.5rem;
    white-space: pre-wrap;
  }

  .singer-synopsis-container {
    padding: 0 0.4rem;
    box-sizing: border-box;
  }

  .sim-singer-container {
    .title {
      margin: 0 0.4rem 0.4rem;
    }
  }
}
</style>