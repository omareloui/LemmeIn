<template>
  <div
    class="glass"
    :class="{
      'glass--circle': circle,
      'glass--float': float,
      'glass--center-content': centerContent
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
        height: backShapeHeight || backShapeSize,
        width: backShapeWidth || backShapeSize,
        'background-color': `hsl(var(--clr-${backShapeColor || tint}))`
      }"
    ></span>
    <div
      class="glass__body"
      :class="bodyClasses"
      :style="{
        'background-color': `hsl(var(--clr-${tint}) / ${opacity}%)`,
        'backdrop-filter': `blur(${blur}px)`,
        color: `hsl(var(--clr-${textColor}))`
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

export default Vue.extend({
  props: {
    size: { type: String },
    width: { type: String },
    height: { type: String },

    blur: { type: Number, default: 4 },
    opacity: { type: Number, default: 20 },

    centerContent: { type: Boolean, default: false },

    float: { type: Boolean, default: false },

    tint: { type: String, default: "info" },
    textColor: { type: String, default: "text-main" },

    circle: { type: Boolean, default: false },
    borderRadius: {
      type: String as PropType<"none" | "sm" | "md" | "lg" | "xl">,
      validator: (v: string) =>
        ["none", "sm", "md", "lg", "xl"].indexOf(v) > -1,
      default: "md"
    },

    noBackShape: { type: Boolean, default: false },
    backShape: {
      type: String as PropType<"square" | "pill" | "circle">,
      validator: (v: string) => ["square", "pill", "circle"].indexOf(v) > -1,
      default: "square"
    },
    backShapeSize: { type: String, default: "60%" },
    backShapeWidth: { type: String },
    backShapeHeight: { type: String },
    backShapePosition: {
      type: String as PropType<"bottom" | "center" | "top">,
      validator: (v: string) => ["bottom", "center", "top"].indexOf(v) > -1,
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

  +m(center-content)
    .glass__body
      +center

  +e(body)
    +size(100%)

  +e(back-shape)
    +inline-block

    +m(square)
      +br-md
    +m(pill)
      border-radius: 10000px
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
