<template>
  <!-- 关注 -->
  <div class="follow-container"
       @click.stop="handleClick"
       :class="followCls">
    <div class="icon">
      <van-icon :name="icon" />
    </div>
    <div class="text">{{text}}</div>
  </div>

</template>
<script>
export default {
  props: {
    followed: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    followCls () {
      return this.followed ? 'followed' : ''
    },
    text () {
      return this.followed ? '已关注' : '关注'
    },
    icon () {
      return this.followed ? 'success' : 'plus'
    }
  },
  methods: {
    handleClick () {
      this.$emit('clickFollow')
    }
  }

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.follow-container {
  display: flex;
  align-items: center;
  padding: 0.15rem 0.2rem;
  border-radius: 0.5rem;
  font-size: $font-size-smaller;
  background: $color-common;
  color: #fff;

  .icon {
    margin-right: 0.1rem;
  }

  &.followed {
    background: #e3e3e3;
    opacity :0.9;
  }
}
</style>