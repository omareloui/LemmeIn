<template>
  <button
    :type="type"
    class="button"
    :class="{ 'button--loading': isLoading }"
    :style="{ width: width || size, height: height || size }"
    :disabled="isDisabled"
    @click="onClick('single')"
    @dblclick="onClick('dbl')"
  >
    <transition name="fade">
      <span class="button__loader" v-if="isLoading">
        <loader-primary
          :size="large ? 35 : 20"
          :stroke-width="large ? 3 : 2"
          :color="cta ? 'text-light' : 'primary'"
        ></loader-primary>
      </span>
    </transition>

    <transition name="fade">
      <span v-if="!isLoading" class="button__content">
        <slot></slot>
      </span>
    </transition>
  </button>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    type: { type: String, default: "button" },
    width: { type: String },
    height: { type: String },
    size: { type: String },
    isLoading: { type: Boolean, default: false },
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
  +w(min 40px)
  +h(min 30px)
  background: none
  overflow: hidden

  &[disabled="disabled"]
    opacity: 0.8
    +not-allowed

  +m(loading)
    +not-allowed
</style>
