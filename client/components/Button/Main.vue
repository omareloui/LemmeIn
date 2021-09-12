<template>
  <button-base
    class="button-main"
    :class="{
      'button-main--cta': cta,
      'button-main--block': block,
      'button-main--large': large,
      'button-main--dont-block-on-mobile': dontBlockOnMobile
    }"
    v-bind="{ type, width, isDisabled }"
    @click="onClick('single')"
    @dblclick="onClick('dbl')"
  >
    <transition name="fade">
      <span class="button-main__loader" v-if="isLoading">
        <loader-primary
          :size="large ? 35 : 20"
          :stroke-width="large ? 3 : 2"
          :color="cta ? 'text-light' : 'primary'"
        ></loader-primary>
      </span>
    </transition>

    <transition name="fade">
      <span v-if="!isLoading" class="button-main__content">
        <slot></slot>
      </span>
    </transition>
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

$width-on-base: clamp(140px, 20vw,100%)
$width-on-large: clamp(160px, 30vw,100%)

.button-main
  +br-md
  +clr-bg(button)
  +size(100% 40px)

  +lt-mobile
    +w($width-on-base)
    +inline-block
    +m(large)
      +w($width-on-large)

  +e(loader)
    +not-allowed
    +center

  +e(content)
    +inline-block
    +center
    +w(100%)
    +no-wrap

  +m(cta)
    +clr-bg(primary)
    .button-main__content
      +clr-txt(light)

  +m(large)
    +h(50px)
    .button-main__loader
      +size(35px)
    .button-main__content
      +fnt-xl

  +m(dont-block-on-mobile)
    +w($width-on-base)

  +lt-mobile
    +m(block)
      +block
      +w(100%)
</style>
