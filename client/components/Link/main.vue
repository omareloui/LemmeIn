<template>
  <link-base
    v-bind="{ to, target, isDisabled }"
    class="link-main"
    :class="{ 'link-main--disabled': isDisabled }"
  >
    <slot></slot>
  </link-base>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

const TARGETS = ["_blank", "_self", "_parent", "_top"] as const
type TargetValues = typeof TARGETS[number]

export default Vue.extend({
  props: {
    to: { type: String, required: true },
    isDisabled: { type: Boolean, default: false },
    target: {
      type: String as PropType<TargetValues>,
      validator: v => TARGETS.indexOf(v) > -1
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.link
  +clr-txt(link)
  +italic
  +m(disabled)
    +clr-txt(link, $opacity: 0.5)
    +not-allowed
</style>
