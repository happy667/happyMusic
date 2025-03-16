<template>
  <div class="personalization-container">
    <slot></slot>
    <div class="container">
      <div class="ai-emotional-radio-station item animated fadeIn"
           @click="openAiDialog"><span class="title">AI情绪电台</span></div>
      <div class="scenario-based-recommendation item animated fadeIn"><span class="title">场景化推荐</span></div>
      <div class="hearing-health-protection item animated fadeIn"><span class="title">听力健康守护</span></div>

    </div>
    <!-- 输入框 -->
    <van-dialog v-model="show"
                title="AI情绪电台"
                confirm-button-color="#FD4979"
                confirm-button-text="搜索"
                show-cancel-button
                @confirm="goToSearch"
                :lazy-render="false">
      <van-field type="textarea"
                 v-model="message"
                 rows="2"
                 autosize
                 autofocus
                 maxlength="50"
                 placeholder="说点什么吧，比如'想要放松的轻音乐~"
                 show-word-limit
                 class="message" />
    </van-dialog>
  </div>
</template>
<script>
import nlpApi from '@/api/nlp.js'
import {
  mapMutations
} from 'vuex'
export default {
  data () {
    return {
      show: false,
      message: ''
    }
  },
  components: {

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
    async goToSearch () {
      try {
        if (this.message === '') {
          this.$toast('请输入内容')
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
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.personalization-container {
  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 0.4rem 0.4rem;

    .item {
      position: relative;
      width: 2.7rem;
      height: 2.7rem;
      line-height: 2.7rem;
      text-align: center;
      box-sizing: border-box;
      border-radius: 0.3rem;
      box-shadow: 0 0.12rem 0.2rem rgba(0, 0, 0, 0.05);
      font-size: 0.4rem;
      color: #fff;
      font-weight: bolder;

      span.title {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0.8rem;
        line-height: 0.8rem;
        border-radius: 0 0 0.3rem 0.3rem;
        color: #fff;
        font-size: $font-size-smaller-x;
        background-color: rgba(0, 0, 0, 0.45);
        box-sizing: border-box;
        letter-spacing: 0.05rem;
      }
    }

    .ai-emotional-radio-station {
      background: url('../../../assets/images/ai-emotional-radio-station.jpg') center center no-repeat;
      background-size: cover;
    }

    .scenario-based-recommendation {
      background: url('../../../assets/images/scenario-based-recommendation.jpg') center center no-repeat;
      background-size: cover;
    }

    .hearing-health-protection {
      background: url('../../../assets/images/hearing-health-protection.jpg') center center no-repeat;
      background-size: cover;
    }

    .van-field {
      border: 1px solid #e2e2e2;
      width: 90%;
      margin: 12px auto 28px auto;
      background: #f6f6f6;
    }
  }
}
</style>