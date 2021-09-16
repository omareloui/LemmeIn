<template>
  <div
    class="glass"
    :class="{
      'glass--circle': circle,
      'glass--float': float,
      'glass--center-content': centerContent,
      'glass--clickable': clickable
    }"
    :style="{
      width: width || size,
      height: height || size
    }"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <span
      v-if="!noBackShape"
      class="glass__back-shape"
      :class="`glass__back-shape--${backShape} glass__back-shape--${backShapePosition}`"
      :style="{
        '--height': backShapeHeight || backShapeSize,
        '--width': backShapeWidth || backShapeSize,
        '--background': `var(--clr-${backShapeColor || tint})`
      }"
    ></span>
    <div
      class="glass__body"
      :contenteditable="editable"
      :class="bodyClasses"
      :tabindex="focusable ? 0 : undefined"
      @click="$emit('click')"
      @dblclick="$emit('dblclick')"
      @keyup.space="$emit('keyup:space')"
      @keyup.enter="$emit('keyup:enter')"
      :style="{
        '--background': `hsl(var(--clr-hs-${tint}) var(--clr-l-${tint}) / var(--clr-o-${
          opacity * 100
        }))`,
        '--blur': `${blur}px`,
        '--color': `var(--clr-${textColor})`
      }"
      v-bind="{ role, ...aria }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

const OPACITY_OPTIONS = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1
] as const
const BORDER_RADIUS_OPTIONS = ["none", "sm", "md", "lg", "xl"] as const
const BACK_SHAPE_OPTIONS = ["square", "pill", "circle"] as const
const BACK_SHAPE_POSITIONS = ["bottom", "center", "top"] as const

type OpacityOptions = typeof OPACITY_OPTIONS[number]
type BorderRadiusOptions = typeof BORDER_RADIUS_OPTIONS[number]
type BackShapeOptions = typeof BACK_SHAPE_OPTIONS[number]
type BackShapePositions = typeof BACK_SHAPE_POSITIONS[number]

export default Vue.extend({
  props: {
    size: { type: String },
    width: { type: String },
    height: { type: String },

    blur: { type: Number, default: 4 },
    opacity: {
      type: Number as PropType<OpacityOptions>,
      validator: (v: OpacityOptions) => OPACITY_OPTIONS.indexOf(v) > -1,
      default: 0.2
    },

    editable: { type: Boolean, default: false },

    centerContent: { type: Boolean, default: false },

    float: { type: Boolean, default: false },

    tint: { type: String, default: "info" },
    textColor: { type: String, default: "text-main" },

    circle: { type: Boolean, default: false },
    borderRadius: {
      type: String as PropType<BorderRadiusOptions>,
      validator: (v: BorderRadiusOptions) =>
        BORDER_RADIUS_OPTIONS.indexOf(v) > -1,
      default: "md"
    },

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
    bodyClasses(): string {
      let classes = ""
      if (this.borderRadius && this.borderRadius !== "none")
        classes += `br-${this.borderRadius}`
      return classes
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.glass
  +pos-r
  +m(circle)
    .glass__body
      +br-cr
  +m(float)
    .glass__body
      +float(1)

  +m(clickable)
    +clickable

  +m(center-content)
    .glass__body
      +center

  +e(body)
    +size(100%)
    +focus-effect
    +clr-txt(--color)
    +clr-bg(--background)
    backdrop-filter: blur(var(--blur))

  +e(back-shape)
    +inline-block
    +clr-bg(--background)
    +w(var(--width))
    +h(var(--height))

    +m(square)
      +br-md
    +m(pill)
      +br-bl
    +m(circle)
      +br-cr

    +m(center)
      +center
    +m(bottom)
      +pos-a(bottom 3% left 50%)
      transform: translateX(-50%)
    +m(top)
      +pos-a(top 0 left 50%)
      transform: translateX(-50%)
</style>
