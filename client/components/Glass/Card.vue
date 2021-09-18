<template>
  <component
    :is="tag"
    class="glass"
    :class="classes"
    :style="{
      '--back-shape-height': !noBackShape
        ? backShapeHeight || backShapeSize
        : undefined,
      '--back-shape-width': !noBackShape
        ? backShapeWidth || backShapeSize
        : undefined,
      '--back-shape-background': !noBackShape
        ? `var(--clr-${backShapeColor || tint})`
        : undefined,
      '--background': `hsl(var(--clr-hs-${tint}) var(--clr-l-${tint}) / var(--clr-o-${
        opacity * 100
      }))`,
      '--blur': `${blur}px`,
      '--color': `var(--clr-${textColor})`
    }"
    :contenteditable="editable ? true : undefined"
    :tabindex="focusable ? 0 : undefined"
    v-bind="{ role, ...aria }"
    @click="$emit('click')"
    @dblclick="$emit('dblclick')"
    @keyup.space="$emit('keyup:space')"
    @keyup.enter="$emit('keyup:enter')"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

const OPACITY_OPTIONS = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1
] as const
const BACK_SHAPE_OPTIONS = ["square", "pill", "circle"] as const
const BACK_SHAPE_POSITIONS = ["bottom", "center", "top"] as const

type OpacityOptions = typeof OPACITY_OPTIONS[number]
type BackShapeOptions = typeof BACK_SHAPE_OPTIONS[number]
type BackShapePositions = typeof BACK_SHAPE_POSITIONS[number]

export default Vue.extend({
  props: {
    tag: { type: String, default: "div" },

    blur: { type: Number, default: 4 },
    opacity: {
      type: Number as PropType<OpacityOptions>,
      validator: (v: OpacityOptions) => OPACITY_OPTIONS.indexOf(v) > -1,
      default: 0.2
    },

    editable: { type: Boolean, default: false },

    float: { type: Boolean, default: false },

    tint: { type: String, default: "info" },
    textColor: { type: String, default: "text-main" },

    circle: { type: Boolean, default: false },

    focusable: { type: Boolean, default: false },
    clickable: { type: Boolean, default: false },

    role: { type: String },
    aria: { type: Object },

    noBackShape: { type: Boolean, default: false },
    backShape: {
      type: String as PropType<BackShapeOptions>,
      validator: (v: BackShapeOptions) => BACK_SHAPE_OPTIONS.indexOf(v) > -1,
      default: "square"
    },
    backShapeSize: { type: String, default: "60%" },
    backShapeWidth: { type: String },
    backShapeHeight: { type: String },
    backShapePosition: {
      type: String as PropType<BackShapePositions>,
      validator: (v: BackShapePositions) =>
        BACK_SHAPE_POSITIONS.indexOf(v) > -1,
      default: "center"
    },
    backShapeColor: { type: String }
  },

  computed: {
    classes(): string {
      let classes = ""
      if (this.circle) classes += " glass--circle"
      if (this.float) classes += " glass--float"
      if (this.clickable) classes += " glass--clickable"
      if (!this.noBackShape)
        classes += ` glass--has-back-shape glass--back-shape--${this.backShape} glass--back-shape--${this.backShapePosition}`
      return classes
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.glass
  +focus-effect
  +clr-txt(--color)

  > :first-child
    +clr-bg(--background)
    backdrop-filter: blur(var(--blur))

  +m(circle)
    +br-cr
  +m(float)
    +float(1)
  +m(clickable)
    +clickable

  &.glass--has-back-shape
    &::before
      content: ""
      z-index: -1
      +tran
      +clr-bg(--back-shape-background)
      +w(var(--back-shape-width))
      +h(var(--back-shape-height))

  &.glass--back-shape
    +m(square)
      &::before
        +br-md
    +m(pill)
      &::before
        +br-bl
    +m(circle)
      &::before
        +br-cr

    +m(center)
      &::before
        +center
    +m(bottom)
      &::before
        +pos-a(bottom 3% left 50%)
        transform: translateX(-50%)
    +m(top)
      &::before
        +pos-a(top 0 left 50%)
        transform: translateX(-50%)
</style>
