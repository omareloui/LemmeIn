<template>
  <pattern-base
    v-bind="{ fixed, top, right, left, bottom }"
    class="pattern-dots"
    :style="{
      '--dots-gap': gridGap,
      '--dot-offset': dotsOffset,
      '--dot-size': dotSize
    }"
  >
    <span
      class="dot-container"
      v-for="index in 9"
      :key="index"
      :style="{
        width: dotSize,
        height: dotSize
      }"
    >
      <span class="dot" :style="{ 'background-color': `var(--clr-${color})` }">
      </span>

      <glass-circle
        class="dot-glass"
        v-bind="{ opacity, blur }"
        :tint="color"
        no-back-shape
      >
        <span></span>
      </glass-circle>
    </span>
  </pattern-base>
</template>


<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    fixed: { type: Boolean, default: true },
    top: { type: String },
    bottom: { type: String },
    left: { type: String },
    right: { type: String },

    color: { type: String, default: "persian-rose" },
    dotSize: { type: String, default: "30px" },
    opacity: { type: Number, default: 0.1 },
    blur: { type: Number, default: 3 },
    gridGap: { type: String, default: "20px" },
    dotsOffset: { type: String, default: "10px" }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.pattern-dots
  z-index: -1
  +grid(repeat(3, 1fr), $gap: var(--dots-gap))

  .dot-container
    +pos-r

  .dot
    +inline-block
    +br-cr
    +size(100%)

  .dot-glass
    span
      +pos-a
      top: var(--dot-offset)
      left: var(--dot-offset)
      +br-cr
      +size(var(--dot-size))
</style>
