<template>
  <div class="recent-song-container">
    <!-- loading -->
    <loading :loading="pageLoading" />
    <template v-if="songList.length!==0">
      <play-all :length="songList.length" @play="handlePlayAll(songList)"></play-all>
      <song-list @select="selectSong" ref="songList" :songsList="songList"></song-list>
    </template>

<template v-if="!pageLoading&&songList===0">
      <no-result text="暂无最近播放歌曲"></no-result>
    </template>
</div>
</template>
<script>
    import PlayAll from '@/components/common/PlayAll'
    import SongList from '@/components/home/song/SongList'
    import NoResult from '@/components/common/NoResult'
    import userApi from '@/api/user.js'
    import {
        ERR_OK
    } from '@/api/config.js'
    import {
        mapGetters,
        mapMutations
    } from 'vuex'
    import Song from '@/assets/common/js/song.js'
    import Album from '@/assets/common/js/album.js'
    import Singer from '@/assets/common/js/singer.js'
    import songApi from '@/api/song.js'

    export default {
        name: 'recentPlaySong',
        data() {
            return {
                songList: []
            }
        },
        computed: {
            ...mapGetters(['currentSong']),
            pageLoading() {
                return this.songList.length === 0
            }
        },
        mounted() {
            this.getSongs()
        },
        methods: {
            ...mapMutations(['setPlayerFullScreen']),
            // 播放全部歌曲
            handlePlayAll(list) {
                // 引入vue原型上的utils
                this.$utils.playAllSong(list)
            },
            // 查询单曲
            async getSongs() {
                const {
                    data: res
                } = await userApi.getUserRencent('song')
                if (res.code === ERR_OK) {
                    let songList = []
                    res.data.list.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
                        item = item.data;
                        let singers = item.ar.map(item => item.name).join('/')
                        let singersList = []
                            // 处理歌手
                        item.ar.forEach(item => {
                            singersList.push(new Singer({
                                id: item.id,
                                name: item.name,
                                avatar: item.img1v1Url,
                                picUrl: item.picUrl
                            }))
                        })
                        songList.push(new Song({
                            id: item.id,
                            name: item.name,
                            singers,
                            singersList,
                            mv: item.mv,
                            album: new Album({
                                id: item.al.id,
                                name: item.al.name,
                                picUrl: item.al.picUrl
                            })
                        }))
                    })
                    this.songList = songList
                    this.$emit('songSize', this.songList.length)
                }
            },
            // 选择歌曲
            async selectSong(item, index) {
                this.$emit('closeList')
                    // 比较两首歌曲
                let result = this.$utils.compareSong(this.currentSong, item)
                if (!result) {
                    // 引入vue原型上的utils
                    this.$utils.playMusic(item, this.songList, index)
                }
            },

        },

        components: {
            SongList,
            NoResult,
            PlayAll
        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .recent-song-container {
        padding-top: 0.25rem;
        .song-list-null {
            width: 100%;
            height: 1rem;
            line-height: 1rem;
            color: $color-common-b;
            font-size: $font-size-smaller;
            text-align: center;
        }
    }
</style>