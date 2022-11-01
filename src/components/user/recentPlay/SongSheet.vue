<template>
  <div class="recent-songSheet-container">
    <!-- loading -->
    <loading :loading="pageLoading" />
    <template v-if="songSheetList.length!==0">
      <song-sheet-list :list="songSheetList"></song-sheet-list>
    </template>
<template v-if="!pageLoading&&songSheetList.length===0">
      <no-result text="暂无最近播放歌单"></no-result>
    </template>
</div>
</template>
<script>
    import SongSheetList from '@/components/home/songSheet/SongSheetList'
    import NoResult from '@/components/common/NoResult'
    import userApi from '@/api/user.js'
    import {
        ERR_OK
    } from '@/api/config.js'
    import {
        mapState
    } from 'vuex'
    export default {
        name: 'rencentPlaySongSheet',
        data() {
            return {
                songSheetList: []
            }
        },
        computed: {
            pageLoading() {
                return this.songSheetList.length === 0
            }
        },
        mounted() {

            this.getRencentPlaySongSheet()
        },
        methods: {
            // 查询歌单
            async getRencentPlaySongSheet() {

                const {
                    data: res
                } = await userApi.getUserRencent('playlist')
                if (res.code === ERR_OK) {
                    let songSheetList = []
                    res.data.list.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
                        item = item.data;
                        songSheetList.push(item)
                    })
                    this.songSheetList = songSheetList
                    this.$emit('songSheetSize', this.songSheetList.length)
                }
            },
        },

        components: {
            SongSheetList,
            NoResult
        }
    }
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