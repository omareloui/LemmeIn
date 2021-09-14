<template>
  <link-base
    :to="to"
    class="link-button"
    :class="{
      'link-button--cta': cta,
      'link-button--disabled': isDisabled
    }"
    v-bind="{ target, isDisabled }"
  >
    <slot></slot>
  </link-base>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    to: { type: String, required: true },
    cta: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    target: { type: String }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

::v-deep.link
  &.link-button
    +block
    +br-sm
    +ma(0)
    +pa(5px 10px)
    +clr-bg(button)
    +brdr(none)
    +clickable
    +no-underline
    +clr-txt
    +center-text

    +lt-mobile
      +w (clamp(140px, 20vw,100%))

    +m(cta)
      +clr-bg(primary)
      +clr-txt(light)

    +m(disabled)
      opacity: 0.8
      +not-allowed
</style>
