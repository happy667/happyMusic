<template>
  <div class="personalization-container">
    <slot></slot>
    <div class="swiper-container sw-personalization">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div class="daily-recommendation item animated fadeIn" @click="handleDailyRecommendation">
            <span class="title">今日推荐</span>
          </div>
        </div>
        <div class="swiper-slide">
          <div class="scenario-based-recommendation item animated fadeIn" @click="handleScenarioRecommendation">
            <span class="title">场景化推荐</span>
          </div>
        </div>
        <div class="swiper-slide">
          <div class="ai-emotional-radio-station item animated fadeIn" @click="openAiDialog">
            <span class="title">AI情绪电台</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 输入框 -->
    <van-dialog v-model="show" class="input-container" title="AI情绪电台" confirm-button-color="#FD4979"
      confirm-button-text="搜索" show-cancel-button get-container="body" @confirm="goToSearch" :lazy-render="false">
      <van-field type="textarea" v-model="message" rows="2" autosize autofocus maxlength="50"
        placeholder="说点什么吧，比如'想要放松的轻音乐~" show-word-limit class="message" />
    </van-dialog>
  </div>

</template>
<script>
import Swiper from 'swiper'
import Song from '@/assets/common/js/song.js'
import Album from '@/assets/common/js/album.js'
import Singer from '@/assets/common/js/singer.js'
import nlpApi from '@/api/nlp.js'
import recommendApi from '@/api/recommend.js'
import scenarioRecommendation from '@/assets/common/js/scenario-recommendation/scenario-recommendation.js'
import {
  mapMutations
} from 'vuex'
import {
  ERR_OK
} from '@/api/config.js'
export default {
  data () {
    return {
      show: false,
      message: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initSwiper()
    })
  },
  methods: {
    ...mapMutations(['setSearchCurrentIndex', 'setSearchKeywords']),

    openAiDialog () {
      this.message = '';
      this.show = true
    },
    closeAiDialog () {
      this.message = '';
      this.show = false
    },
    initSwiper () {
      setTimeout(() => {
        var mySwiper = new Swiper('.sw-personalization', {
          slidesPerView: 'auto',
          slidesPerGroup: 1,
          touchRatio: 1.2,
          // 解决与vant标签页切换冲突问题
          observer: true,
          observeParents: true,
          // 使用图片懒加载
          lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 3
          },
          on: {
            sliderMove (e) {
              e.stopPropagation()
            }
          }
        })
      }, 0)

    },
    handleDailyRecommendation () {
      if (this.$utils.isLogin()) {
        this.getUserRecommendSong()
      } else {
        this.$utils.alertLogin(this.$router.currentRoute.fullPath)
      }
    },
    //获取每日推荐歌曲
    async getUserRecommendSong () {
      const toast = this.$toast.loading('获取歌曲中...');
      const { data: res } = await recommendApi.getUserRecommendSong()
      if (res.code === ERR_OK) {
        let songList = []
        res.data.dailySongs.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
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
            }),
            isOriginal: !item.originSongSimpleData && (item.originCoverType === 0 || item.originCoverType === 1) ? 1 : 0
          }))
        })
        this.$utils.playAllSong(songList)
        toast.clear()
      }
    },
    //ai智能分析
    async goToSearch () {
      try {
        if (this.message === '') {
          this.$toast('文本内容不能为空哦~')
          return
        }
        const toast = this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: 'AI分析中...'
        });
        const { data: res } = await nlpApi.getKeyWords(this.message);
        let searchWords = res.results.map(item => {
          return item.word
        }).join(' ');
        // 手动清除 Toast
        toast.clear();
        this.setSearchKeywords(searchWords)
        this.closeAiDialog();
        this.$router.push('/search/searchResult')
      } catch (err) {
        toast.clear();
        this.$toast(err)
      }
    },
    //场景化推荐
    async handleScenarioRecommendation () {
      // 显示加载提示
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '场景分析中...'
      });

      try {
        // 获取场景化推荐
        const { data: res } = await scenarioRecommendation.recommend();

        // 根据是否使用默认设置调整提示信息
        if (res.usingDefaultSettings) {
          if (res.locationError) {
            toast.message = `${res.locationError}，使用默认设置`;
          } else {
            toast.message = `使用默认场景设置推荐中...`;
          }
          // 显示位置错误提示，但继续推荐流程
          setTimeout(() => {
            toast.message = `正在为您推荐歌单...`;
          }, 1500);
        } else {
          toast.message = `正在跳转到歌单页面`;
        }

        // 延迟一会儿再跳转
        setTimeout(() => {
          // 关闭提示
          toast.clear();
          // 跳转到歌单详情页
          this.$router.push(`/songSheetDisc/${res.recommendedPlaylist.id}`);
        }, 1000);
      } catch (error) {
        // 关闭加载提示
        toast.clear();
        // 显示错误信息
        this.$toast.fail('抱歉，没有找到合适的推荐歌单');
        console.error('场景推荐失败:', error);
      }
    },
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.personalization-container {
  .swiper-container {
    .swiper-wrapper {
      padding: 0 0.4rem 0.4rem;
      display: flex;
      width: 100%;
      box-sizing: border-box;
      .swiper-slide {
        display: flex;
        justify-content: space-between;
        margin-right: 0.55rem;
        width: 2.7rem;
        height: 2.7rem;
        &:last-child {
          margin-right: 0;
        }
        .item {
          position: relative;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border-radius: 0.3rem;
          box-shadow: 0.06rem 0.06rem 0.14rem rgba(0, 0, 0, 0.4);
          font-size: 0.4rem;

          span.title {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0.8rem;
            line-height: 0.8rem;
            border-radius: 0 0 0.3rem 0.3rem;
            color: #fff;
            text-align: center;
            font-size: $font-size-smaller-x;
            background-color: rgba(0, 0, 0, 0.45);
            box-sizing: border-box;
            letter-spacing: 0.05rem;
          }
        }
        .daily-recommendation {
          background: url('../../../assets/images/daily-recommendation.jpg') center center no-repeat;
          background-size: cover;
        }
        .ai-emotional-radio-station {
          background: url('../../../assets/images/ai-emotional-radio-station.jpg') center center no-repeat;
          background-size: cover;
        }

        .scenario-based-recommendation {
          background: url('../../../assets/images/scenario-based-recommendation.jpg') center center no-repeat;
          background-size: cover;
        }
      }
    }
  }
}
</style>