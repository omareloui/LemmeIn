<template>
  <button
    :type="type"
    class="button button-base"
    :aria-label="ariaLabel"
    :disabled="isDisabled"
    @click="onClick('single')"
    @dblclick="onClick('dbl')"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    type: { type: String, default: "button" },
    ariaLabel: { type: String },
    isDisabled: { type: Boolean, default: false }
  },

  methods: {
    onClick(event: "single" | "dbl") {
      if (!this.isDisabled)
        this.$emit(event === "single" ? "click" : "dblclick")
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.button
  +pos-r
  +br-md
  +brdr(none)
  +clickable
  +center-text
  +fnt(body)
  background: none

  &.button-base
    +focus-effect

  &[disabled="disabled"]
    opacity: 0.8
    +not-allowed
</style>
