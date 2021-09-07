<template>
  <svg
    :style="{
      '--stroke-width': `${this.strokeWidth}px`,
      '--stroke-clr': `hsl(var(--clr-${this.color}))`,
      '--loader-primary-size': `${this.size}px`,
      '--loader-primary-speed': `${this.speed}s`
    }"
  >
    <circle
      :cx="size / 2"
      :cy="size / 2"
      :r="size / 2 - strokeWidth"
      :style="this.hasRoundStrokeEdges ? 'stroke-linecap: round;' : ''"
    ></circle>
  </svg>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    color: { type: String, default: "primary" },
    size: { type: Number, default: 75 },
    strokeWidth: { type: Number, default: 5 },
    speed: { type: Number, default: 3 },
    hasRoundStrokeEdges: { type: Boolean, default: false }
  }
})
</script>

<style lang="sass" scoped>
// @use "~/assets/scss/mixins" as *

// svg
//   width: var(--loader-primary-size)
//   height: var(--loader-primary-size)
//   animation: rotate calc(var(--loader-primary-speed) / 2) linear infinite

//   circle
//     +size(100%)
//     fill: none
//     stroke: var(--stroke-clr)
//     stroke-width: var(--stroke-width)
//     stroke-dasharray: calc(var(--loader-primary-size) * 3)
//     stroke-dashoffset: calc(var(--loader-primary-size) * 3)
//     animation: primary-loader var(--loader-primary-speed) linear infinite

// @keyframes primary-loader
//   0%, 100%
//     stroke-dashoffset: calc(var(--loader-primary-size) * 3)
//   50%
//     stroke-dashoffset: 0
//   50.1%
//     stroke-dashoffset: calc(var(--loader-primary-size) * 6)

// @keyframes rotate
//   to
//     transform: rotate(360deg)
</style>
