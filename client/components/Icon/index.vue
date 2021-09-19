<template>
  <i
    class="icon-wrapper"
    :class="{
      'icon-wrapper--clickable': clickable,
      'icon-wrapper--focusable': focusable
    }"
    :style="{
      '--width': width || size,
      '--height': height || size,
      '--fill': Array.isArray(fill)
        ? $accessor.theme.currentTheme === 'light'
          ? fill[0]
          : fill[1]
        : fill.match(/^#[\da-f]{3,8}$/i)
        ? fill
        : `var(--clr-${fill})`,
      '--stroke': stroke && `var(--clr-${stroke})`
    }"
    :tabindex="focusable ? 0 : undefined"
    @click="onClick('single')"
    @dblclick="onClick('dbl')"
    @keyup.enter="$emit('keyup:enter')"
    @keyup.space="$emit('keyup:space')"
    :aria-label="ariaLabel"
  >
    <svg :viewBox="`0 0 ${viewBox}`">
      <transition name="fade">
        <component :is="`icon-${name}`"></component>
      </transition>
    </svg>
  </i>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    name: { type: String, required: true },
    size: { type: String, default: "25px" },
    width: { type: String },
    height: { type: String },
    viewBox: { type: String, default: "32 32" },
    fill: { default: "text-main" },
    stroke: { type: String },
    clickable: { type: Boolean, default: false },
    focusable: { type: Boolean, default: false },
    ariaLabel: { type: String }
  },

  methods: {
    onClick(event: "single" | "dbl") {
      this.$emit(event === "single" ? "click" : "dblclick")
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.icon-wrapper
  +pos-r
  +inline-block
  +h(var(--height))
  +w(var(--width))
  +focus-effect
  +br-sm

  svg
    +center
    +clr(--fill, fill)
    +clr(--stroke, stroke)
    +size(100%)

  +m(focusable)
    svg
      +focus-effect(icon)

  +m(clickable)
    +clickable
</style>
