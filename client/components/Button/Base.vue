<template>
  <button
    :type="type"
    class="button"
    :style="{ width: width || size, height: height || size }"
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
    width: { type: String },
    height: { type: String },
    size: { type: String },
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
  +focus-effect
  +brdr(none)
  +clickable
  +center-text
  background: none

  &[disabled="disabled"]
    opacity: 0.8
    +not-allowed
</style>
