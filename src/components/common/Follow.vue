<template>
  <!-- 关注 -->
  <div class="follow-container"
       @click.stop="handleClick"
       :class="[followCls,plainCls]">
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
    },
    followText: {
      type: String,
      default: () => '关注'
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
      return this.followed ? (this.followText || '已关注') : '关注';
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
  padding: 0.2rem 0.4rem;
  border-radius: 0.5rem;
  font-size: $font-size-smaller-x;
  background: $color-common;
  color: #fff;

  .text {
    height: 0.4rem;
    line-height: 0.4rem;
  }

  &.plain {
    color: $color-common;
    background: #fff;
    border: 0.02rem solid $color-common;
  }

  &.followed {
    color: $color-common-b2;
    background: $color-common-b;
    opacity: 0.9;
    border: 0.02rem solid $color-common-b;
  }
}
</style>