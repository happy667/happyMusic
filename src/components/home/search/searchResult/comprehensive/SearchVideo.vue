<template>
  <!-- 视频 -->
  <div class="search"
       v-if="video&&video.videoList.length!==0">
    <div class="search-video">
      <Title title="视频"></Title>
      <video-list @select="goToVideoInfo"
                  :list="video.videoList"></video-list>
      <div class="more"
           v-if="video.moreText"
           @click="$emit('setIndex',5)">
        <div class="text">
          {{video.moreText}}
        </div>
        <div class="icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Title from '@/components/common/Title'
import videoList from '@/components/common/video/VideoList'
export default {
  props: {
    video: Object
  },
  methods: {
    goToVideoInfo (video) {
      this.$router.push(`/videoInfo/${video.id}`)
    }
  },
  components: {
    videoList,
    Title
  }
}
</script>