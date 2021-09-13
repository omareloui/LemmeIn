<template>
  <div
    class="pattern-dots"
    :style="{ '--dots-gap': gridGap, '--dot-offset': dotsOffset }"
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
        :size="dotSize"
        :tint="color"
        no-back-shape
      ></glass-circle>
    </span>
  </div>
</template>


<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    color: { type: String, default: "pink" },
    dotSize: { type: String, default: "30px" },
    opacity: { type: Number, default: 0.15 },
    blur: { type: Number, default: 3 },
    gridGap: { type: String, default: "20px" },
    dotsOffset: { type: String, default: "10px" }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.pattern-dots
  +pos-a
  z-index: -1

  display: grid
  grid-template-columns: repeat(3, 1fr)
  gap: var(--dots-gap)

  .dot-container
    +pos-r

  .dot
    +inline-block
    +br-cr
    +size(100%)
  .dot-glass
    +pos-a
    top: var(--dot-offset)
    left: var(--dot-offset)
</style>
