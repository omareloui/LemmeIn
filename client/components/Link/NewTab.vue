<template>
  <link-base
    v-bind="{ to, isDisabled }"
    target="_blank"
    class="link-new-tab"
    :class="{ 'link-main--disabled': isDisabled }"
  >
    <slot></slot>
    <icon name="new-tab" class="link-new-tab__icon" size="12px" />
  </link-base>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    to: { type: String, required: true },
    isDisabled: { type: Boolean, default: false }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.link-new-tab
  +pos-r
  +clr-txt(link)
  +italic
  +pa(8px 18px)
  +inline-block
  +clr-bg(secondary)

  +m(disabled)
    +clr-txt(link, $opacity: 0.5)
    +not-allowed

  +e(icon)
    +pos-a(top 5px right 5px)
    opacity: 0.8
</style>
