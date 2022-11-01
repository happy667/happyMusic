<template>
  <div class="album-container">
    <!-- loading -->
    <loading :loading="pageLoading" />
    <template v-if="albumList.length!==0">
      <div class="album-list">
        <album-list :list="albumList" @select="selectAlbum"></album-list>
      </div>
    </template>
<template v-if="!pageLoading&&albumList.length===0">
      <no-result text="暂无最近播放专辑"></no-result>
    </template>
</div>
</template>
<script>
    import AlbumList from '@/components/common/album/AlbumList'
    import NoResult from '@/components/common/NoResult'
    import userApi from '@/api/user.js'
    import Album from '@/assets/common/js/album.js'
    import {
        ERR_OK
    } from '@/api/config.js'
    export default {
        name: 'recentPlayAlbum',
        data() {
            return {
                albumList: []
            }
        },
        computed: {
            pageLoading() {
                return this.albumList.length === 0
            }
        },
        mounted() {
            this.getAlbums()
        },
        methods: {
            // 查询专辑
            async getAlbums() {
                const {
                    data: res
                } = await userApi.getUserRencent('album')
                if (res.code === ERR_OK) {
                    console.log(123)

                    let albumList = []
                    res.data.list.forEach(item => {
                        item = item.data;
                        let album = new Album({
                            id: item.id,
                            name: item.alias.length > 0 ? `${item.name} (${item.alias.join('/')})` : item.name,
                            picUrl: item.picUrl,
                            singerName: item.artists.map(item => item.name).join('/'),
                            publishTime: item.publishTime
                        })
                        albumList.push(album)
                    })
                    this.albumList = albumList
                    this.$emit('albumSize', this.albumList.length)
                }

            },
            // 选择专辑
            selectAlbum(item) {
                this.$router.push(`/singerAlbum/${item.id}`)
            }
        },

        components: {
            NoResult,
            AlbumList
        }
    }
</script>
<style lang="stylus" scoped>
    .album-container {
        padding: 0 0.4rem;
    }
</style>