<template>
  <div
    class="input-range-container"
    :class="{ 'input-range-container--show-value': !doNotShowValue }"
    :style="{
      '--range-percentage': Math.round(((value - min) / (max - min)) * 100)
    }"
  >
    <label v-if="label" :for="identifier">
      {{ label }}
    </label>

    <div class="input-value-container">
      <output v-if="!doNotShowValue" class="input-value" :for="identifier">
        <glass-card no-back-shape tint="primary">
          {{ value }}
        </glass-card>
      </output>
    </div>

    <input
      :id="identifier"
      class="input-range"
      type="range"
      v-bind="{ min, max, step }"
      :value="value"
      @input="onInput($event.target.value)"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    value: { type: Number, required: true },
    identifier: { type: String, required: true },
    label: { type: String },
    min: { type: Number, default: 4 },
    max: { type: Number, default: 30 },
    step: { type: Number, default: 1 },
    doNotShowValue: { type: Boolean, default: false }
  },

  methods: {
    onInput(value: string) {
      this.$emit("input", parseInt(value, 10))
    }
  },
  watch: {
    min(newValue: number, oldValue: number) {
      if (newValue > oldValue && this.value === oldValue)
        this.onInput(newValue.toString())
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

=track
  +clickable
  +tran
  +size(var(--track-width) var(--track-height))

=progress
  +clr-bg(primary)
  +h(var(--track-height))
  +br-bl

=thumb
  +clr-bg(input-range-thumb)
  +br-cr
  +size(var(--thumb-size))
  backdrop-filter: blur(2px)

.input-range-container
  --thumb-size: 25px
  --track-width: 100%
  --track-height: 10px

  +w(clamp(150px, 80%, 330px))

  +m(show-value)
    +mt(30px)

  .input-value-container
    +pos-r
    +w(calc(100% - var(--thumb-size)))
    +mx(auto)

    .input-value
      +pos-a(top -25px)
      left: calc((var(--range-percentage) * 1%))
      +fnt-lg
      +tran
      transform: translateX(-50%)
      ::v-deep .glass .glass__body
        +pa(3px 5px)

  .input-range
    +input-reset-appearance
    +my(calc(var(--thumb-size) / 4 + 10px))
    +w(var(--track-width))
    +focus-effect(input-range)
    +clr-bg(main)
    +br-bl
    opacity: 0.8

    // The Track //
    &::-webkit-slider-runnable-track
      +track
      +clr-bg(input-range-track)
      +br-bl

    &::-moz-range-track
      +track
      +clr-bg(input-range-track)
      +br-bl

    &::-ms-track
      +track
      +clr-bg(none)
      +clr-txt(none)
      +brdr(none, 0)
    &::-ms-fill-lower
      +clr-bg(input-range-track)
      +br-sm
    &::-ms-fill-upper
      +clr-bg(input-range-track)
      +br-sm

    // The Progress //
    &::-moz-range-progress
      +progress
      // +clr-bg(primary)

    // The Thumb //
    &::-webkit-slider-thumb
      +thumb
      +input-reset-appearance
      +mt(calc(var(--track-height) / 2 * -1))

    &::-moz-range-thumb
      +thumb
      +brdr(none, 0)

    &::-ms-thumb
      +thumb
      +brdr(none, 0)
</style>
