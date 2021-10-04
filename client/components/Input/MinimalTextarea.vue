<template>
  <input
    class="input-minimal"
    v-bind="{ value, type, placeholder }"
    @input="onInput"
  />
</template>

<script lang="ts">
import Vue from "vue"
import { HTMLInputEvent } from "~/@types"

export default Vue.extend({
  props: {
    value: { type: String, required: true },
    type: { type: String, default: "text" },
    placeholder: { type: String, default: "text" }
  },
  methods: {
    onInput(e: HTMLInputEvent) {
      this.$emit("input", e.target.value)
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
  &:focus
    outline: none
</style>
