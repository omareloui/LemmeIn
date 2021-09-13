<template>
  <div
    class="pattern-circle"
    :style="{
      width: size,
      height: size
    }"
  >
    <span
      class="small-circles"
      :style="{
        '--small-circles-offset': smallCirclesOffset
      }"
    >
      <span
        v-for="index in 4"
        :key="index"
        class="circle"
        :style="{
          'background-color': `var(--clr-${color})`,
          width: smallCirclesSize,
          height: smallCirclesSize
        }"
      >
      </span>
    </span>

    <glass-circle
      class="glass"
      v-bind="{ size, opacity, blur }"
      :tint="color"
      no-back-shape
    ></glass-circle>
  </div>
</template>


<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    color: { type: String, default: "orange" },
    size: { type: String, default: "200px" },
    opacity: { type: Number, default: 0.15 },
    blur: { type: Number, default: 3 },
    smallCirclesSize: { type: String, default: "20px" },
    smallCirclesOffset: { type: String, default: "60px" }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.pattern-circle
  +pos-a
  z-index: -1
  +w(min-content)

  .small-circles
    +pos-a(right 40% bottom 30%)

    .circle
      +pos-a
      +br-cr
      &:first-child
        top: 0
        left: var(--small-circles-offset)
      &:nth-child(2)
        top: var(--small-circles-offset)
        left: 0
      &:nth-child(3)
        top: var(--small-circles-offset)
        left: var(--small-circles-offset)
      &:nth-child(4)
        top: 0
        left: 0

  .glass
    +pos-a
</style>
