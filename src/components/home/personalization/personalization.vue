<template>
  <div class="personalization-container">
    <slot></slot>
    <div class="swiper-container sw-personalization">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div class="daily-recommendation item animated"
               @click="handleDailyRecommendation">
            <span class="title">今日推荐</span>
          </div>
        </div>
        <div class="swiper-slide">
          <div class="scenario-based-recommendation item animated"
               @click="handleScenarioRecommendation">
            <span class="title">场景化推荐</span>
          </div>
        </div>
        <div class="swiper-slide">
          <div class="ai-emotional-radio-station item animated"
               @click="openAiDialog">
            <span class="title">AI情绪电台</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 输入框 -->
    <van-dialog v-model="show"
                class="input-container"
                title="AI情绪电台"
                :show-confirm-button="!showAnalysisResult"
                confirm-button-color="#FD4979"
                confirm-button-text="分析"
                :show-cancel-button="!showAnalysisResult"
                get-container="body"
                @confirm="goToSearch"
                :before-close="beforeClose"
                :close-on-click-overlay="true"
                :lazy-render="false">
      <!-- 输入区域 -->
      <template v-if="!showAnalysisResult">
        <div class="message-container">
          <van-field type="textarea"
                     v-model="message"
                     rows="3"
                     autosize
                     autofocus
                     :maxlength="50"
                     placeholder='"说说你现在的心情、想听什么类型的音乐，比如"今天心情低落，想听点治愈的音乐"'
                     show-word-limit
                     class="message" />
        </div>
      </template>
      <!-- 分析结果展示区域 -->
      <template v-if="showAnalysisResult && aiAnalysisResult">
        <p class="tip-text">基于情感分析为您推荐歌单</p>
        <div class="analysis-result">
          <!-- 情感分析卡片 -->
          <div class="analysis-card sentiment-card"
               v-if="sentimentData">
            <div class="title">情感分析</div>
            <div class="sentiment-type"
                 :style="sentimentData ? { backgroundColor: getSentimentTypeColor(), color: getSentimentTextColor() } : {}">
              {{ sentimentData ? getSentimentType() : '' }}
            </div>
            <div class="sentiment-meter">
              <div class="progress">
                <div class="meter-bar">
                  <div class="meter-fill"
                       :style="sentimentFillStyle">
                  </div>
                </div>
                <div class="meter-labels">
                  <span>消极</span>
                  <span class="confidence"
                        :style="{ color: getSentimentTypeColor() }">{{ confidenceValue }}%</span>
                  <span>积极</span>
                </div>
              </div>
            </div>
            <div class="sentiment-description">
              {{ getSentimentDescription() }}
            </div>
          </div>

          <!-- 音乐推荐卡片 -->
          <div class="analysis-card recommendation-card">
            <div class="title">推荐音乐类型</div>
            <div class="music-tags">
              {{ aiAnalysisResult.recommendation ? aiAnalysisResult.recommendation.searchKeyword :
                aiAnalysisResult.searchKeyword }}
            </div>
            <p class="recommendation-tip">
              已根据您的情感状态，为您精心推荐以上音乐
            </p>

            <!-- 情感调节器 -->
            <div class="mood-adjuster">
              <div class="title">调整推荐</div>
              <div class="adjuster-buttons">
                <button v-for="adjuster in moodAdjusters"
                        :key="adjuster.key"
                        class="adjust-btn"
                        @click="handleMoodAdjust(adjuster.key, $event)">
                  <span class="adjuster-label">{{ adjuster.label }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <button class="btn-cancel"
                    @click="showAnalysisResult = false">取消</button>
            <button class="btn-confirm"
                    :disabled="isRecommendingPlaylist"
                    @click="continueToSearch">
              {{ isRecommendingPlaylist ? '正在查找歌单...' : '为我推荐歌单' }}
            </button>
          </div>
        </div>
      </template>
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
import { recommendByEmotion } from '@/assets/common/js/playlist-recommender.js'
import { adjustRecommendation } from '@/assets/common/js/ai-emotion-radio/emotion-analyzer.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  MOOD_ADJUSTERS
} from '@/assets/common/js/ai-emotion-radio/config.js'
import {
  getSentimentType,
  getSentimentTypeColor,
  getSentimentTextColor,
  getSentimentPercentage,
  getSentimentDescription
} from '@/assets/common/js/ai-emotion-radio/ai-emotion-helper.js'
import { createNumberAnimation } from '@/assets/common/js/utils.js'

export default {
  name: 'Personalization',
  data () {
    return {
      show: false,
      message: '',
      aiAnalysisResult: null,
      aiLoading: false,
      showAnalysisResult: false,
      moodAdjusters: MOOD_ADJUSTERS,
      confidenceValue: 0,
      animationController: null,
      requestInProgress: false,
      isRecommendingPlaylist: false,
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initSwiper()
    })
  },
  activated () {
    this.closeAiDialog()
  },
  computed: {
    sentimentData () {
      return this.aiAnalysisResult?.sentiment;
    },
    sentimentFillStyle () {
      const width = this.getSentimentPercentage() + '%';
      const startColor = this.getSentimentTypeColor(0.3);
      const endColor = this.getSentimentTypeColor();
      return {
        width,
        background: `linear-gradient(90deg, ${startColor}, ${endColor})`
      };
    }
  },
  methods: {
    beforeClose (action, done) {
      if (action === 'confirm') {
        this.goToSearch()
        done(false)
      } else {
        done(true)
      }
    },
    openAiDialog () {
      this.message = '';
      this.aiAnalysisResult = null;
      this.showAnalysisResult = false;
      this.show = true;
    },
    closeAiDialog () {
      this.show = false
      this.showAnalysisResult = false;
      this.message = '';
      this.aiAnalysisResult = null;
    },
    initSwiper () {
      setTimeout(() => {
        var mySwiper = new Swiper('.sw-personalization', {
          slidesPerView: 'auto',
          slidesPerGroup: 1,
          touchRatio: 1.2,
          observer: true,
          observeParents: true,
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
    async getUserRecommendSong () {
      const toast = this.$toast.loading(
        {
          duration: 0,
          message: '获取歌曲中...'
        })
      const { data: res } = await recommendApi.getUserRecommendSong()
      if (res.code === ERR_OK) {
        let songList = []
        res.data.dailySongs.map((item) => {
          let singers = item.ar.map(item => item.name).join('/')
          let singersList = []
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
        toast.clear();
        this.$utils.playAllSong(songList)
      
      }
    },
    async goToSearch () {
      try {
        if (this.requestInProgress || this.aiLoading) {
          return;
        }

        if (!this.message) {
          this.$toast('文本内容不能为空哦~');
          return;
        }

        this.requestInProgress = true;
        this.aiLoading = true;
        const toast = this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: 'AI分析中...'
        });

        try {
          const [depparserRes, sentimentRes] = await Promise.all([
            nlpApi.getDepParser(this.message).catch(err => ({ data: { items: [] } })),
            nlpApi.getSentimentAnalysis(this.message).catch(err => ({ data: { items: [{ sentiment: 1, confidence: 0.5 }] } })),
          ]);

          const result = await nlpApi.generateMusicKeywords(sentimentRes, depparserRes);

          // 设置分析结果
          this.aiAnalysisResult = {
            ...result,
            sentiment: sentimentRes.data?.items?.[0] || null
          };

          this.showAnalysisResult = true;
          this.startConfidenceAnimation();
        } catch (err) {
          this.$toast.fail('AI分析失败，请稍后重试');
        } finally {
          toast.clear();
          this.aiLoading = false;
          this.requestInProgress = false;
        }
      } catch (err) {
        this.aiLoading = false;
        this.requestInProgress = false;
      }
    },
    async handleScenarioRecommendation () {
      const toast = this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: '场景分析中...'
      });

      try {
        console.log('开始请求场景推荐...');
        // 获取场景推荐
        const response = await scenarioRecommendation.recommend();
        console.log('场景推荐原始返回:', response);

        // 处理直接返回数据的情况(非标准axios响应格式)
        let res;
        if (response && response.data) {
          // 标准axios响应格式
          res = response.data;
        } else if (response && (response.recommendedPlaylist || response.searchKeyword)) {
          // 直接返回结果对象的情况
          res = response;
        } else {
          console.error('无法解析场景推荐返回值:', response);
          throw new Error('场景推荐返回数据格式异常');
        }

        console.log('场景推荐数据处理后:', res);

        // 检查是否有推荐失败标记
        if (res.recommendationFailed) {
          throw new Error(res.errorMessage || '场景推荐失败');
        }

        // 设置提示消息
        if (res.usingDefaultSettings) {
          if (res.locationError) {
            toast.message = `${res.locationError}，使用默认设置`;
          } else {
            toast.message = `使用默认场景设置推荐中...`;
          }
          setTimeout(() => {
            toast.message = `正在为您推荐歌单...`;
          }, 1500);
        } else {
          toast.message = `正在跳转到歌单页面`;
        }

        // 确保recommendedPlaylist存在且有ID
        if (!res.recommendedPlaylist || !res.recommendedPlaylist.id) {
          console.error('推荐歌单数据无效:', res.recommendedPlaylist);
          throw new Error('未找到推荐歌单');
        }

        console.log('准备跳转到歌单:', res.recommendedPlaylist.id);

        // 延迟跳转以显示toast消息
        setTimeout(() => {
          toast.clear();
          this.$router.push(`/songSheetDisc/${res.recommendedPlaylist.id}`);
        }, 1000);
      } catch (error) {
        console.error('场景推荐完整错误:', error);
        toast.clear();
        this.$toast.fail(error.message || '抱歉，没有找到合适的推荐歌单');
      }
    },

    async continueToSearch () {
      if (this.isRecommendingPlaylist) {
        return;
      }
      this.isRecommendingPlaylist = true;
      const toast = this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: '查找最佳匹配歌单中...'
      });
      try {
        const recommendedPlaylist = await recommendByEmotion(this.aiAnalysisResult);
        if (!recommendedPlaylist || !recommendedPlaylist.id) {
          console.error('[推荐流程] 未找到匹配的歌单');
          throw new Error('未找到匹配的歌单');
        }
        toast.message = '找到匹配歌单，正在跳转...';
        setTimeout(() => {
          this.closeAiDialog();
          toast.clear();
          this.$router.push(`/songSheetDisc/${recommendedPlaylist.id}`);
        }, 1500);
      } catch (error) {
        this.$toast.fail('歌单匹配失败，请稍后再试');
      } finally {
        this.isRecommendingPlaylist = false;
      }
    },
    adjustAiResult (adjustment) {
      try {
        const currentRecommendation = this.aiAnalysisResult;
        const adjustedResult = adjustRecommendation(adjustment, currentRecommendation);

        if (!adjustedResult) {
          throw new Error('调整推荐失败');
        }

        this.aiAnalysisResult = {
          ...this.aiAnalysisResult,
          recommendation: adjustedResult,
          searchKeyword: adjustedResult.searchKeyword
        };
        this.$toast("音乐类型调整为" + this.aiAnalysisResult.searchKeyword)
      } catch (error) {
        console.error('调整推荐失败:', error);
        this.$toast.fail(error.message || '调整推荐失败，请重试');
      }
    },
    getSentimentType () {
      return getSentimentType(this.sentimentData);
    },
    getSentimentTypeColor (alpha = 1) {
      return getSentimentTypeColor(this.sentimentData, alpha);
    },
    getSentimentTextColor () {
      return getSentimentTextColor(this.sentimentData);
    },
    getSentimentPercentage () {
      return getSentimentPercentage(this.sentimentData);
    },
    getSentimentDescription () {
      return getSentimentDescription(this.sentimentData);
    },
    startConfidenceAnimation () {
      if (this.animationController) {
        this.animationController.stop();
        this.animationController = null;
      }
      const targetValue = this.getSentimentPercentage();
      try {
        this.animationController = createNumberAnimation({
          startValue: 0,
          endValue: targetValue,
          duration: 800,
          steps: 20,
          onUpdate: (value) => {
            this.confidenceValue = Math.round(value);
          }
        });
        this.animationController.start();
      } catch (error) {
        this.confidenceValue = targetValue;
      }
    },
    handleMoodAdjust (key, event) {
      // 找到当前点击的按钮
      const currentBtn = event.currentTarget;

      // 添加激活类
      currentBtn.classList.add('btn-clicked');

      // 调用情感调整方法
      this.adjustAiResult(key);
      setTimeout(() => {
        currentBtn.classList.remove('btn-clicked');
      }, 200);
    }
  },
  watch: {
    'showAnalysisResult': {
      handler (newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.startConfidenceAnimation();
          });
        }
      },
      immediate: false
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.personalization-container {
  .swiper-container {
    .swiper-wrapper {
      padding: 0 0.4rem 0.5rem;
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

.input-container {
  .message-container {
    margin: 0.2rem 0.4rem 0.4rem;

    .message {
      background-color: #f7f8fa;
      border-radius: 0.2rem;
    }
  }

  .tip-text {
    font-size: $font-size-mini;
    color: $color-common-b2;
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
  }

  .analysis-result {
    padding: 0.2rem 0.4rem 0.4rem;
    background: #fff;

    .analysis-card {
      background: #f7f8fa;
      border-radius: 0.2rem;
      padding: 0.3rem;
      margin-bottom: 0.3rem;
      box-shadow: 0 0.02rem 0.08rem rgba(0, 0, 0, 0.05);

      .title {
        margin-bottom: 0.25rem;
        font-size: $font-size-smaller-x;
        font-weight: 600;
        color: #333;
        display: flex;
        align-items: center;
        height: 0.4rem;

        &::before {
          content: '';
          width: 0.06rem;
          height: 0.35rem;
          background: #fd4979;
          margin-right: 0.15rem;
          border-radius: 0.02rem;
        }
      }

      &.sentiment-card {
        position: relative;

        .sentiment-type {
          position: absolute;
          top: 0.3rem;
          right: 0.3rem;
          font-size: $font-size-mini-x;
          padding: 0.1rem 0.2rem;
          border-radius: 0.2rem;
          background: rgba(253, 73, 121, 0.1);
          color: $color-common;
        }

        .sentiment-meter {
          display: flex;
          align-items: center;
          margin: 0.3rem 0;

          .progress {
            flex: 1;
            position: relative;

            .meter-bar {
              height: 0.16rem;
              background: rgba(0, 0, 0, 0.05);
              border-radius: 0.08rem;
              overflow: hidden;
              position: relative;

              .meter-fill {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                animation: progressFill 0.7s ease-out;
              }
            }

            .meter-labels {
              display: flex;
              justify-content: space-between;
              margin-top: 0.15rem;
              font-size: $font-size-mini;
              color: $color-common-b2;

              .confidence {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                color: $color-common;
                font-weight: bold;
              }
            }
          }
        }

        .sentiment-description {
          margin-top: 0.2rem;
          font-size: $font-size-mini;
          color: $color-common-b2;
          text-align: center;
        }
      }
    }

    .recommendation-card {
      .music-tags {
        background: linear-gradient(90deg, $color-common, #ff758c);
        color: white;
        padding: 0.25rem;
        border-radius: 0.15rem;
        font-size: $font-size-smaller-x;
        text-align: center;
        margin-bottom: 0.1rem;
      }

      .recommendation-tip {
        font-size: $font-size-mini;
        color: $color-common-b2;
        text-align: center;
        margin-bottom: 0.35rem;
        line-height: 1.2;
      }

      .mood-adjuster {
        .adjuster-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.15rem;

          .adjust-btn {
            background: #fff;
            border: none;
            border-radius: 0.25rem;
            height: 0.9rem;
            font-size: $font-size-mini;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 0 0.2rem;
            transition: background-color 0.15s linear, color 0.15s linear;
            position: relative;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);

            &.btn-clicked {
              background-color: $color-common;
              color: white;
            }
          }
        }
      }
    }

    .action-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.4rem;
      margin-top: 0.4rem;

      button {
        height: 0.9rem;
        border-radius: 0.45rem;
        font-size: $font-size-smaller-x;
        border: none;

        &.btn-cancel {
          background: #f7f8fa;
          color: $color-common-b2;
        }

        &.btn-confirm {
          animation: pulse 1.5s infinite;
          background: linear-gradient(90deg, $color-common, #ff758c);
          color: white;

          &:disabled {
            opacity: 0.7;
            animation: none;
            background: linear-gradient(90deg, #fd497980, #ff758c80);
          }
        }
      }
    }
  }
}

@keyframes progressFill {
  from {
    width: 0;
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(253, 73, 121, 0.4);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(253, 73, 121, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(253, 73, 121, 0);
  }
}
</style>