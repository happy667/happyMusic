<template>
  <!-- 关注 -->
  <div class="follow-container"
       @click.stop="handleClick"
       :class="[followCls,plainCls]">
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
    },
    plain: {
      type: Boolean,
      default: () => false
    }

  },
  computed: {
    followCls () {
      return this.followed ? 'followed' : ''
    },
    plainCls () {
      return this.plain ? 'plain' : ''
    },
    text () {
      return this.followed ? '已收藏' : '收藏'
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
  padding: 0.2rem 0.3rem;
  border-radius: 0.5rem;
  font-size: $font-size-smaller-x;
  background: $color-common;
  color: #fff;

  .icon {
    margin-right: 0.1rem;
  }

  &.plain {
    color: $color-common;
    background: $color-common-background;
    border: 0.02rem solid $color-common;
  }

  &.followed {
    color: #fff;
    background: #e3e3e3;
    opacity: 0.9;
    border: none;
  }
}
</style>