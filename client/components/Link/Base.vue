<template>
  <component
    :is="isRelativeLink ? 'nuxt-link' : 'a'"
    :to="nuxtLink"
    :href="aLink"
    class="link"
    :class="{ 'link--disabled': isDisabled }"
    :target="computedTarget"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

type TargetValues = "_blank" | "_self" | "_parent" | "_top"

export default Vue.extend({
  props: {
    to: { type: String, required: true },
    isDisabled: { type: Boolean, default: false },
    target: {
      type: String as PropType<TargetValues>,
      validator: v => ["_blank", "_self", "_parent", "_top"].indexOf(v) > -1
    }
  },

  computed: {
    isRelativeLink(): boolean {
      return this.to?.startsWith("/")
    },

    nuxtLink(): string | undefined {
      if (!this.isRelativeLink) return undefined
      if (this.isDisabled) return this.$route.fullPath
      return this.to
    },

    aLink(): string | undefined {
      if (this.isRelativeLink) return undefined
      if (this.isDisabled) return "#!"
      return this.to
    },

    computedTarget(): string | undefined {
      if (this.isDisabled) return undefined
      if (this.target) return this.target
      if (!this.isRelativeLink) return "_blank"
      return undefined
    }
  }
})
</script>

<style lang="sass" scoped>
// @use "~/assets/scss/functions" as *
// @use "~/assets/scss/mixins" as *

// .link
//   z-index: 0
//   overflow: hidden
//   vertical-align: bottom
//   +pos-r
//   +no-wrap
//   +clr-txt
//   +inline-block
//   +tran(color, 0.2s)
//   +link-reset(false)
//   +px(3px)
//   +mx(-1px)

//   &::before
//     content: ""
//     z-index: -1
//     +pos-a(top 0 left 0)
//     +size(100%)
//     +clr-bg(link)
//     +tran(transform, 0.2s)
//     transform: translateY(calc(100% - 4px))

//   &:not(.link--disabled):hover
//     +clr-txt(invert)
//     &::before
//       transform: translateY(0)

//   &--disabled
//     +not-allowed
//     opacity: 0.8
</style>
