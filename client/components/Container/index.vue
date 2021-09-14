<template>
  <component
    :is="tag"
    class="container"
    :class="{
      'container--custom': !!customMaxWidth,
      'container--has-padding-bottom': hasPaddingBottom
    }"
    :style="{ '--custom-width': customMaxWidth }"
  >
    <component
      :is="headingTag"
      v-if="!noHeading"
      class="container__heading"
      :class="{ 'container__heading--center': centerHeading }"
    >
      <slot name="heading">Heading</slot>
    </component>
    <slot></slot>
  </component>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

type HTMLHeadings = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
type ContainerTags = "div" | "main" | "section"

export default Vue.extend({
  props: {
    noHeading: { type: Boolean, default: false },
    tag: { type: String as PropType<ContainerTags>, default: "div" },
    headingTag: { type: String as PropType<HTMLHeadings>, default: "h1" },
    customMaxWidth: { type: String },
    hasPaddingBottom: { type: Boolean, default: false },
    centerHeading: { type: Boolean, default: false }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.container
  +px(10px)

  +m(has-padding-bottom)
    +pb(30px)

  +lt-desktop
    --container-width: calc(var(--screen-desktop) - 20px)
    +ma(auto)
    +px(0)
    min-width: var(--container-width)
    max-width: var(--container-width)
    width: var(--container-width)

    +m(custom)
      min-width: var(--custom-width)
      max-width: var(--custom-width)
      width: var(--custom-width)

  +e(heading)
    +clr-txt(primary)
    text-align: center
    overflow: hidden
    +lt-tablet
      &:not(.container__heading--center)
        text-align: left
</style>
