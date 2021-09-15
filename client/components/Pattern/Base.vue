<template>
  <div
    class="pattern"
    :class="{ 'pattern--fixed': fixed }"
    :style="{
      '--top': top,
      '--right': right,
      '--bottom': bottom,
      '--left': left
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    fixed: { type: Boolean, default: true },
    top: { type: String },
    bottom: { type: String },
    left: { type: String },
    right: { type: String }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.pattern
  &--fixed
    +pos-f
    @each $pos in top right bottom left
      #{$pos}: var(--#{$pos})
</style>
