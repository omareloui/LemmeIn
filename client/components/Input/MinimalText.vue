<template>
  <component
    :is="isTextarea ? 'textarea' : 'input'"
    ref="minimalInput"
    class="input-minimal"
    :class="{ 'input-minimal--textarea': isTextarea }"
    v-bind="{ placeholder }"
    :value="isTextarea ? undefined : value"
    :type="isTextarea ? undefined : type"
    @input="onInput"
    >{{ isTextarea ? value : undefined }}</component
  >
</template>

<script lang="ts">
import Vue from "vue"
import { HTMLInputEvent, ExtendVueRefs } from "~/@types"

export default (
  Vue as ExtendVueRefs<{ minimalInput: HTMLInputElement }>
).extend({
  props: {
    value: { type: String, required: true },
    type: { type: String, default: "text" },
    placeholder: { type: String },
    isTextarea: { type: Boolean, default: false },
    default: { type: String }
  },

  mounted() {
    this.updateValue(this.default || this.value)
  },

  computed: {
    element() {
      return this.$refs.minimalInput
    }
  },

  methods: {
    updateValue(value: string) {
      this.$emit("input", value)
      if (this.isTextarea) this.autoResize()
    },
    onInput(e: HTMLInputEvent) {
      this.updateValue(e.target.value)
    },

    autoResize() {
      const input = this.element
      input.style.height = "5px"
      input.style.height = `${input.scrollHeight}px`
    },

    async focus() {
      this.element.focus()
      this.moveCursorToEnd()
    },

    moveCursorToEnd() {
      const input = this.$refs.minimalInput
      input.selectionStart = this.value.length
      input.selectionEnd = this.value.length
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.input-minimal
  +block
  +clr-bg(none)
  +w(100%)
  border: none
  +fnt(body)
  +no-scroll
  &:focus
    outline: none

  +m(textarea)
    +h(auto)
    resize: none
</style>
