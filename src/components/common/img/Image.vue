<template>
  <div class="image-wrapper animated fadeIn" :style="imgStyle">
    <img v-lazy="src" :style="loadBgStyle" :key="src" />
  </div>
</template>
<script>
export default {
  props: {
    src: String,
    size: {
      type: String,
      default: () => "normal",
    },
  },
  computed: {
    imgStyle() {
      let style = null;
      if (this.size === "normal") {
        style = {
          width: "1rem",
          height: "1rem",
        };
      } else if (this.size === "middle") {
        style = {
          width: "1.25rem",
          height: "1.25rem",
        };
      } else if (this.size === "big") {
        style = {
          width: "1.6rem",
          height: "1.6rem",
        };
      }
      return style;
    },
    loadBgStyle() {
      return !this.src ? "background:#f2f3f5" : "";
    },
  },
};
</script>
<style lang="stylus" scoped>

.image-wrapper {
  border-radius: 50%;

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
</style>
