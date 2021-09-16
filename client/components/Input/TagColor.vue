<template>
  <div
    class="input-color"
    :class="{
      'input-color--has-error': isErred
    }"
    :id="identifier"
  >
    <div class="colors">
      <div
        v-for="(color, index) in colors"
        :key="index"
        tabindex="0"
        class="colors__color"
        :class="{ 'colors__color--selected': color === value }"
        :style="{ '--color': `var(--clr-${color})` }"
        @click="select(color)"
        @keyup.space="select(color)"
        @keyup.enter="select(color)"
      ></div>
    </div>

    <transition name="fade">
      <span v-if="isErred" class="input-color__error">{{ errorMessage }}</span>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { TagColor } from "~/@types"
import tagColors from "~/config/tag-colors"

export default Vue.extend({
  props: {
    identifier: { type: String, required: true },
    value: { type: String, required: true },
    default: { type: String },
    notRequired: { type: Boolean, default: false },
    doNotSelectDefault: { type: Boolean, default: false }
  },

  data: () => ({
    colors: tagColors,
    errorMessage: ""
  }),

  created() {
    if (!this.doNotSelectDefault) this.select(this.colors[0])
    if (this.default) {
      const defaultColor = this.colors.find(x => x === this.default)
      if (!defaultColor) throw new Error("Can't find this color.")
      this.select(defaultColor)
    }
  },

  computed: {
    isErred(): boolean {
      return !!this.errorMessage
    }
  },

  methods: {
    select(color: TagColor) {
      if (this.isErred) this.clearError()
      if (color === this.value) return this.$emit("input", "")
      return this.$emit("input", color)
    },

    validate() {
      if (!this.notRequired && !this.value)
        this.setError("You have to select a color.")
    },

    setError(message: string) {
      this.errorMessage = message
    },
    clearError() {
      this.errorMessage = ""
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.input-color
  +pos-r
  +mt(20px)
  +tran

  +m(has-error)
    +mb(20px)

  +e(error)
    +pos-a(left 10px bottom 0)
    transform: translateY(100%)
    +clr-txt(error)
    +fnt-xs

  .colors
    +auto-fit(50px, 10px)
    +e(color)
      +pos-r
      +clr-bg(--color)
      +size(40px)
      +br-md
      +clickable
      +focus-effect
      &::after
        content: ""
        +center
        +clr-bg(light)
        +br-cr
        +tran
        +size(20px)
        opacity: 0

      +m(selected)
        &::after
          opacity: 1
</style>
