<template>
  <div class="search"
       v-if="simQuery&&simQuery.length!==0">
    <div class="search-album">
      <Title title="大家还在搜"></Title>
      <search-list :list="simQuery"
                   @select="handleSimSearch">
      </search-list>
    </div>
  </div>
</template>
<script>
import Title from '@/components/common/Title'
import SearchList from '@/components/home/search/SearchList'
import { mapMutations } from 'vuex'
export default {
  props: {
    simQuery: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    ...mapMutations(['setSelectSearchWord', 'setIsAdvance']),
    // 处理相关查询
    handleSimSearch (item) {
      // 设置为前进页面
      this.setIsAdvance(true)
      this.setSelectSearchWord(item)
    }
  },
  components: {
    Title,
    SearchList
  }
}
</script>