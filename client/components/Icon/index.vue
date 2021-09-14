<template>
  <i
    class="icon-wrapper"
    :class="{ 'icon-wrapper--is-clickable': isClickable }"
    :style="{ width: width || size, height: height || size }"
    @click="onClick('single')"
    @dblclick="onClick('dbl')"
    @keyup.enter="$emit('keyup:enter')"
    @keyup.space="$emit('keyup:space')"
  >
    <svg
      :viewBox="`0 0 ${viewBox}`"
      :style="{
        '--fill': `var(--clr-${fill})`,
        '--stroke': stroke && `var(--clr-${stroke})`
      }"
      :tabindex="isFocusable ? 0 : -1"
    >
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
    fill: { type: String, default: "text-main" },
    stroke: { type: String },
    isClickable: { type: Boolean, default: false },
    isFocusable: { type: Boolean, default: false }
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
  svg
    +center
    +focus-effect(icon)
    +clr(--fill, fill)
    +clr(--stroke, stroke)
    +size(100%)

  +m(is-clickable)
    +clickable
</style>
