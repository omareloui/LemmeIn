<template>
  <div
    class="password-strength"
    :class="{
      'password-strength--has-text': shape === 'line' && !hideScoreText
    }"
  >
    <div
      class="progress-bar"
      v-if="strength && shape === 'line'"
      :style="{
        '--percentage': strength.percentage,
        '--color': `var(${strength.color})`,
        '--height': lineHeight
      }"
    >
      <span class="progress"></span>
    </div>
    <span
      v-if="strength && shape === 'line' && !hideScoreText"
      class="score-text"
    >
      {{ strength.score }}/{{ strength.maxScore }}
    </span>

    <div
      v-if="strength && shape === 'dot'"
      class="dot"
      :style="{
        '--color': `var(${strength.color})`,
        '--size': dotSize
      }"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { PasswordStrength } from "~/@types"

const PROGRESS_STYLES = ["line", "dot"] as const
type ProgressStyle = typeof PROGRESS_STYLES[number]

export default Vue.extend({
  props: {
    decryptedPassword: { type: String, required: true },
    isDuplicated: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: () => new Date() },

    shape: {
      type: String as PropType<ProgressStyle>,
      validator: (v: ProgressStyle) => PROGRESS_STYLES.indexOf(v) > -1,
      default: "line"
    },
    lineHeight: { type: String, default: "5px" },
    dotSize: { type: String, default: "15px" },
    hideScoreText: { type: Boolean, default: false }
    // showSuggestions: { type: Boolean, default: false },
  },

  data: () => ({
    strength: null as PasswordStrength | null
  }),

  created() {
    this.loadPasswordStrength()
  },

  methods: {
    async loadPasswordStrength() {
      this.strength = await this.getPasswordStrength()
    },

    async getPasswordStrength() {
      return this.$getPasswordStrength(
        this.decryptedPassword,
        this.lastUpdated as Date,
        this.isDuplicated
      )
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.password-strength
  +pos-r

  .progress-bar
    +w(100%)
    +h(var(--height))
    +br-bl
    +clr-bg(secondary)
    overflow: hidden

    .progress
      +block
      +br-bl
      +h(100%)
      +w(calc(var(--percentage) * 1%))
      +clr-bg(--color)

  .score-text
    +fnt-sm
    +center-v
    right: 0

  +m(has-text)
    +pr(5ch)
    +my(7px)

  .dot
    +size(var(--size))
    +clr-bg(--color)
    +br-cr
</style>
