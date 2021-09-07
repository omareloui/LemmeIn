<template>
  <button
    :type="type"
    class="button"
    :class="{
      'button--cta': isCta,
      'button--block': isBlock,
      'button--dont-block-on-mobile': dontBlockOnMobile,
      'button--large': isLarge,
      'button--loading': isLoading
    }"
    :style="{ width }"
    :disabled="isDisabled"
    @click="onClick('single')"
    @dblclick="onClick('dbl')"
  >
    <transition name="fade">
      <span class="button__loader" v-if="isLoading">
        <loader-primary
          :size="isLarge ? 35 : 20"
          :stroke-width="isLarge ? 3 : 2"
          :color="isCta ? 'light' : 'primary'"
        ></loader-primary>
      </span>
    </transition>

    <transition name="fade">
      <span v-if="!isLoading" class="button__text">
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
    isLoading: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    isCta: { type: Boolean, default: false },
    isLarge: { type: Boolean, default: false },
    isBlock: { type: Boolean, default: false },
    dontBlockOnMobile: { type: Boolean, default: false }
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
// @use "~/assets/scss/mixins" as *

// $width-on-base: 130px
// $width-on-large: 180px

// .button
//   +pos-r
//   +br-md
//   +focus-effect
//   +brdr(none)
//   +clr-bg(button)
//   +clickable
//   +block
//   +size(100% 40px)
//   text-align: center
//   overflow: hidden

//   +screen-larger-than-mobile
//     +w($width-on-base)
//     +inline-block
//     +m(large)
//       +w($width-on-large)

//   +e(loader)
//     +center
//     +size(20px)
//   +e(text)
//     +center
//     +w(100%)
//     +fnt-base
//     white-space: nowrap

//   &[disabled="disabled"]
//     +not-allowed
//     opacity: 0.8

//   +m(loading)
//     +not-allowed

//   +m(cta)
//     +clr-bg(primary)
//     .button__text
//       +clr-txt(light)

//   +m(large)
//     +h(50px)
//     .button__loader
//       +size(35px)
//     .button__text
//       +fnt-xl

//   +m(dont-block-on-mobile)
//     +w($width-on-base)

//   +m(block)
//     +block
//     +w(100%)
</style>
