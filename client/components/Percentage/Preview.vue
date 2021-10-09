<template>
  <div class="percentage">
    <svg
      viewBox="-1 -1 34 34"
      :style="{
        '--stroke-width': strokeWidth,
        '--stroke-clr': `var(--clr-${color})`,
        '--size': size,
        '--percentage': pct
      }"
    >
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">
        {{ pct }}%
      </text>
      <circle cx="16" cy="16" r="15.9155"></circle>
      <circle cx="16" cy="16" r="15.9155" class="bar"></circle>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import sleep from "~/assets/utils/sleep"

export default Vue.extend({
  props: {
    percentage: { type: Number, required: true },
    size: { type: String, default: "100px" },
    color: { type: String, default: "primary" },
    strokeWidth: { type: String, default: "1.8" },
    hasRoundStrokeEdges: { type: Boolean, default: false }
  },

  data: () => ({
    pct: 0
  }),

  computed: {
    radius(): number {
      return parseInt(this.size, 10) / 2 - parseInt(this.strokeWidth, 10)
    }
  },

  mounted() {
    this.updateShownPercentage()
  },

  methods: {
    async updateShownPercentage() {
      if (this.pct >= this.percentage) return
      this.pct++
      await sleep(20)
      this.updateShownPercentage()
    }
  }
})
</script>

<style lang="sass" scoped>
@use "sass:math"
@use "~/assets/scss/mixins" as *

.percentage
  +w(min-content)

  svg
    +tran
    +size(var(--size))
    transform: rotate(-90deg)

    text
      font-size: 0.5rem
      +clr(text-main, fill)
      transform: rotate(90deg) translateY(2px)
      transform-origin: center

  circle
    +tran($timing-function: linear)
    fill: none
    +clr(background-secondary, stroke, $opacity: 0.4)
    stroke-width: var(--stroke-width)

    &.bar
      stroke: var(--stroke-clr)
      stroke-linecap: round
      stroke-dasharray: 100 100
      stroke-dashoffset: calc(100 - var(--percentage))
</style>
