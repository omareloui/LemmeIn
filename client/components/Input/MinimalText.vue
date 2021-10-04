<template>
  <div
    role="textbox"
    :contenteditable="true"
    :tabindex="0"
    class="input-minimal"
    :class="{
      'input-minimal--textarea': isTextarea,
      'input-minimal--placeholder-shown': !value
    }"
    @input="onInput"
  >
    {{ value || shownText }}
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { HTMLInputEvent } from "~/@types"

export default Vue.extend({
  props: {
    value: { type: String, required: true },
    type: { type: String, default: "text" },
    placeholder: { type: String, default: "" },
    isTextarea: { type: Boolean, default: false },
    default: { type: String }
  },

  created() {
    if (this.default) this.updateValue(this.default)
  },

  data() {
    return {
      shownText: this.value || this.placeholder
    }
  },

  methods: {
    updateValue(value: string) {
      this.$emit("input", value || "")
    },
    onInput(e: HTMLInputEvent) {
      const { value } = e.target
      if (value === this.shownText) this.updateValue(value)
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

  +m(textarea)
    +h(auto)

  +m(placeholder-shown)
    +clr-txt(main, $opacity: 0.4)
</style>
