<template>
  <div @touchstart="_ts" @touchend="_te" @click.capture="_cc">
    <slot />
  </div>
</template>
<script>
import { tabSwipeMixin } from "@/assets/common/js/mixin.js";
export default {
  mixins: [tabSwipeMixin],
};
</script>
