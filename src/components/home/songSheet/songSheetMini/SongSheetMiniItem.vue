<template>
  <div class="song-sheet-mini-item-container" @click="goToSongSheetInfo">
    <!--  图片 -->
    <div class="img">
      <img v-lazy="item.coverImgUrl" class="animated fadeIn" :key="item.coverImgUrl" />
    </div>
    <!-- 信息 -->
    <article class="info">
      <!-- 标题 -->
      <div class="title">{{item.name}}</div>
      <div class="bottom">
        <!-- 数量 -->
        <div class="number">{{item.trackCount}}首</div>
        <!-- 来自 -->
        <div class="from">来自{{item.creator.nickname}}</div>
      </div>

    </article>
    <div class="functions" @click.stop="handleHpenFunctions">
      <van-icon name="ellipsis" />
    </div>
    <van-popup v-model="showPopup" round position="bottom" :get-container="getContainer">
      <div class="popup-content">
        <div class="title">{{'歌单: '+item.name}}</div>
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
                    message: '你确定要删除该歌单吗',
                    confirmButtonText: '删除'
                }).then(async() => {
                    if (this.item.userId === this.user.userId) {
                        this.$toast("不能删除自己的歌单!")
                        return
                    }
                    userApi.updateFollowSongSheet(this.item.id, false).then(res => {
                        if (res.data.code === ERR_OK) {
                            this.$toast("删除成功!")
                            this.$emit("removeSongSheetItem", this.id);
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
    .song-sheet-mini-item-container .functions>>>.van-icon-ellipsis {
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
                margin-right: 0.6rem;
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
    
    .song-sheet-mini-item-container {
        width: 100%;
        display: flex;
        margin-bottom: 0.3rem;
        .img {
            margin-right: 0.4rem;
            width: 1.3rem;
            height: 1.3rem;
            background: $color-common-b;
            border-radius: 0.2rem;
            img {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 0.2rem;
            }
            .play-num {
                position: absolute;
                right: 0.1rem;
                top: 0.1rem;
                color: #fff;
            }
        }
        .info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;
            .title {
                line-height: 0.5rem;
                color: $color-common-x;
                font-size: $font-size-smaller-x;
                no-wrap();
            }
            .bottom {
                display: flex;
                color: $color-common-b2;
                height: 0.6rem;
                line-height: 0.6rem;
                font-size: $font-size-mini;
                no-wrap();
                .number {
                    margin-right: 0.3rem;
                }
                .from {
                    flex: 1;
                    width: 1%;
                    no-wrap();
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