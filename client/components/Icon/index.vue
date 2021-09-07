<template>
  <i
    class="icon-wrapper"
    :class="{ 'icon-wrapper--is-clickable': isClickable }"
    :style="{ width: size, height: size }"
    @click="onClick('single')"
    @dblclick="onClick('dbl')"
  >
    <svg
      :viewBox="`0 0 ${viewBox} ${viewBox}`"
      :style="{ fill, stroke }"
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
    viewBox: { type: Number, default: 32 },
    fill: { type: String },
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
// @use "~/assets/scss/mixins" as *

// .icon-wrapper
//   +inline-block
//   svg
//     +focus-effect(icon)

//   &--is-clickable
//     +clickable
</style>
