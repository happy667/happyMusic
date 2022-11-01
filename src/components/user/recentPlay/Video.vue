<template>
  <div class="recent-video-container">
    <!-- loading -->
    <loading :loading="pageLoading" />
    <template v-if="mvList.length!==0">

      <div class="mv-list">
        <mv-list @select="goToVideoInfo" :list="mvList"></mv-list>
      </div>
    </template>
<template v-if="!pageLoading&&mvList===0">
      <no-result text="暂无最近播放MV"></no-result>
    </template>
</div>
</template>
<script>
    import MvList from '@/components/common/video/VideoList'
    import NoResult from '@/components/common/NoResult'
    import userApi from '@/api/user.js'
    import Video from '@/assets/common/js/video.js'
    import {
        ERR_OK
    } from '@/api/config.js'
    export default {
        name: 'recentPlayVideo',
        data() {
            return {
                mvList: [],
            }
        },
        computed: {
            pageLoading() {
                return this.mvList.length === 0;
            }
        },
        mounted() {
            this.getMV()
        },
        methods: {
            // 查询MV
            async getMV() {
                const {
                    data: res
                } = await userApi.getUserRencent('video')
                if (res.code === ERR_OK) {
                    // 用于保存处理后的视频列表
                    let videoList = []
                    res.data.list.forEach(item => {
                        item = item.data
                        if (item.artists) {
                            let video = new Video({
                                id: item.id,
                                coverUrl: item.coverUrl,
                                name: item.name,
                                playCount: item.playCount,
                                duration: item.duration,
                                creatorName: item.artists.map(item => item.name).join('/')
                            })
                            videoList.push(video)
                        }

                    })
                    this.mvList = videoList
                    this.$emit('videoSize', this.mvList.length)
                }
            },
            goToVideoInfo(mv) {
                this.$router.push(`/videoInfo/${mv.id}`)
            }
        },

        components: {
            MvList,
            NoResult
        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .recent-video-container {
        padding: 0.25rem 0.4rem 0;
        box-sizing: border-box;
    }
</style>