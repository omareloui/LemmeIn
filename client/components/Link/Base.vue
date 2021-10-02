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
@use "~/assets/scss/mixins" as *

.link
  +no-underline
  +clr-txt
  +br-md
  +mx(-5px)
  +px(5px)
  &:not(.link--disabled)
    +clickable

  +m(disabled)
    +clr-txt($opacity: 0.5)
    +not-allowed
</style>
