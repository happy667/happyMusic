<template>
  <div class="image-wrapper"
       :style="imgStyle">
    <img v-lazy="src"
         :key="src"
         class="animated fadeIn" />
  </div>
</template>
<script>
    export default {
        props: {
            src: String,
            size: {
                type: String,
                default: () => 'normal'
            }
        },
        computed: {
            imgStyle() {
                let style = null
                if (this.size === 'normal') {
                    style = {
                        width: '1rem',
                        height: '1rem'
                    }
                } else if (this.size === 'middle') {
                    style = {
                        width: '1.25rem',
                        height: '1.25rem'
                    }
                } else if (this.size === 'big') {
                    style = {
                        width: '1.6rem',
                        height: '1.6rem'
                    }
                }
                return style
            }
        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .image-wrapper {
        border-radius: 50%;
        background-color: $color-common-b;
        img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
</style>