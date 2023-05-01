<template>
  <div class="album-container">
    <div class="album-image">
      <div class="image-container">
        <div class="image">
          <img v-lazy="item.picUrl" class="animated fadeIn">
        </div>
        <div class="digital-album">
          <img src="@/assets/images/digital-album.svg" class="animated fadeIn">
        </div>
      </div>
    </div>
    <article class="info">
      <div class="name">{{item.name}}</div>
      <div class="desc">
        <span class="singer" v-if="showSinger">{{item.singerName}}</span>
        <span class="time" v-if="showTime">{{item.publishTime|convertDate('.')}}</span>
        <span class="song-Size" v-if="showSongSize">{{item.size}}首</span>
      </div>
    </article>
    <div class="functions" v-if="showFunctions" @click.stop="handleHpenFunctions">
      <van-icon name="ellipsis" />
    </div>
    <van-popup v-model="showPopup" round position="bottom" :get-container="getContainer">
      <div class="popup-content">
        <div class="title">{{'专辑: '+item.name}}</div>
        <div class="functions">
          <div class="delete" @click="handleDelete">
            <div class="icon">
              <i class="iconfont icon-shanchu"></i>
            </div>
            <div class="text">删除</div>
          </div>

        </div>
        <div class="cancle" @click="showPopup=false">取消</div>
      </div>
    </van-popup>

  </div>
</template>
<script>
    import userApi from '@/api/user.js'
    import {
        ERR_OK
    } from '@/api/config.js'
    import {
        mapState
    } from 'vuex'
    export default {
        props: {
            item: {
                type: Object
            },
            showSinger: {
                type: Boolean,
                default: () => true
            },
            showSongSize: {
                type: Boolean,
                default: () => false
            },
            showTime: {
                type: Boolean,
                default: () => true
            },
            showFunctions: {
                type: Boolean,
                default: () => false
            }
        },
        data() {
            return {
                actions: [{
                    name: '删除'
                }, {
                    name: '选项二'
                }, {
                    name: '选项三'
                }],
                showPopup: false
            }
        },
        computed: {
            ...mapState(['user'])
        },
        methods: {
            goToSongSheetInfo() {
                if (!this.showPopup) {
                    this.$router.push(`/songSheetDisc/${this.item.id}`)
                }

            },
            handleHpenFunctions() {
                console.log(123)
                this.showPopup = !this.showPopup;
            },
            handleDelete() {
                this.showPopup = false;
                this.$utils.alertConfirm({
                    message: '你确定要删除该专辑吗',
                    confirmButtonText: '删除'
                }).then(async() => {
                    userApi.updateFollowAlbum(this.item.id, false).then(res => {
                        if (res.data.code === ERR_OK) {
                            this.$toast("删除成功!")
                            this.$emit("removeAlbumItem", this.item.id);
                        }
                    }).catch(err => {
                        this.$toast(err.data.message)
                    })

                    this.showActionSheet = false;
                })
            },
            getContainer() {
                return document.querySelector('#app')
            }

        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .album-container .functions>>>.van-icon-ellipsis {
        transform: rotate(90deg);
    }
    
    .popup-content {
        font-size: $font-size-smaller-x;
        .title {
            padding: 0 0.4rem;
            height: 1.2rem;
            line-height: 1.2rem;
            color: #999;
            no-wrap();
        }
        .functions {
            padding: 0 0 0.2rem 0.4rem;
            .icon {
                margin-right: 0.4rem;
                font-size: $font-size-smaller;
            }
            .text {
                text-align: center;
            }
            .delete {
                display: flex;
                height: 1rem;
                line-height: 1rem;
                color: $color-common-x;
            }
        }
        .cancle {
            text-align: center;
            border-top: 0.02rem solid #efefef;
            height: 1.4rem;
            line-height: 1.4rem;
        }
    }
    
    .album-container {
        padding: 0.25rem 0;
        display: flex;
        .album-image {
            margin-right: 0.5rem;
            .image-container {
                position: relative;
                width: 1.3rem;
                height: 1.3rem;
                .image {
                    width: 100%;
                    height: 100%;
                    background: $color-common-b;
                    border-radius: 0.1rem;
                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                        border-radius: 0.1rem;
                    }
                }
                .digital-album {
                    position: absolute;
                    top: 5%;
                    left: 56%;
                    width: 100%;
                    height: 100%;
                    img {
                        display: block;
                        width: 100%;
                        height: 90%;
                    }
                }
            }
        }
        .info {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .name {
                line-height: 0.6rem;
                no-wrap();
                font-size: $font-size-smaller-x;
            }
            .desc {
                display: flex;
                color: $color-common-b2;
                height: 0.6rem;
                line-height: 0.6rem;
                font-size: $font-size-mini;
                span {
                    margin-right: 0.2rem;
                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
        }
        .functions {
            width: 0.6rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>