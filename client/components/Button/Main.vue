<template>
  <button-base
    class="button-main"
    :class="{
      'button-main--cta': cta,
      'button-main--block': block,
      'button-main--large': large,
      'button-main--dont-block-on-mobile': dontBlockOnMobile
    }"
    v-bind="{
      type,
      width,
      isLoading,
      isDisabled
    }"
    @click="onClick('single')"
    @dblclick="onClick('dbl')"
  >
    <slot></slot>
  </button-base>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    type: { type: String, default: "button" },
    width: { type: String },
    isLoading: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    cta: { type: Boolean, default: false },
    large: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
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
@use "~/assets/scss/mixins" as *

$width-on-base: max(20vw,140px)
$width-on-large: max(30vw,160px)

.button-main
  +br-md
  +clr-bg(button)
  +size(100% 40px)

  +lt-mobile
    +w($width-on-base)
    +inline-block
    +m(large)
      +w($width-on-large)

  ::v-deep .button__loader
    +center
    +size(20px)

  ::v-deep .button__content
    +inline-block
    +center
    +w(100%)
    +no-wrap

  +m(cta)
    +clr-bg(primary)
    ::v-deep .button__content
      +clr-txt(light)

  +m(large)
    +h(50px)
    ::v-deep .button__loader
      +size(35px)
    ::v-deep .button__content
      +fnt-xl

  +m(dont-block-on-mobile)
    +w($width-on-base)
  +lt-mobile
    +m(block)
      +block
      +w(100%)
</style>
