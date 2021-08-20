<template>
  <div
    class="input-wrapper"
    :class="{
      'input-wrapper--hover-label': value || isFocus,
      'input-wrapper--has-label': !!label,
      'input-wrapper--has-error': !!errorMessage,
      'input-wrapper--has-left-icon': !!leftIcon,
      'input-wrapper--has-right-icon': !!rightIcon
    }"
  >
    <label v-if="label" :for="identifier" class="label">
      {{ label }}
    </label>

    <input
      @focus="onFocus"
      @blur="onBlur"
      :type="type"
      :id="identifier"
      :name="name || identifier"
      :placeholder="placeholder || ''"
      :autocomplete="noAutocomplete ? 'off' : 'on'"
      :value="value"
      @input="onInput"
      class="input"
    />

    <transition name="fade">
      <span v-if="!!errorMessage" class="error">{{ errorMessage }}</span>
    </transition>

    <transition v-for="side of ['right', 'left']" :key="side" name="fade">
      <icon
        :name="side === 'right' ? rightIcon : side === 'left' ? leftIcon : null"
        v-if="
          (side === 'right' && !!rightIcon) || (side === 'left' && leftIcon)
        "
        @click="handleIconClick(side)"
        @keyup.enter.native="handleIconClick(side)"
        @keyup.space.native="handleIconClick(side)"
        size="28px"
        :isClickable="
          (side === 'left' && isLeftIconClickable) ||
          (side === 'right' && isRightIconClickable)
        "
        :isFocusable="
          (side === 'left' && isLeftIconClickable) ||
          (side === 'right' && isRightIconClickable)
        "
        :class="`icon icon--${side}`"
        :fill="!!errorMessage ? 'hsl(var(--clr-error))' : ''"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { HTMLInputEvent } from "~/@types"

export default Vue.extend({
  props: {
    value: { type: String, required: true },
    identifier: { type: String, required: true },

    name: { type: String },
    type: { type: String, default: "text" },
    placeholder: { type: String },
    label: { type: String },

    minLength: { type: Number, default: 3 },
    maxLength: { type: Number, default: 150 },
    notRequired: { type: Boolean, default: false },
    pattern: { type: RegExp },
    invalidPatternMessage: {
      type: String,
      default: "This is an invalid value."
    },

    noAutocomplete: { type: Boolean, default: false },
    focusOnMount: { type: Boolean, default: false },

    leftIcon: { type: String },
    rightIcon: { type: String },
    isRightIconClickable: { type: Boolean, default: false },
    isLeftIconClickable: { type: Boolean, default: false }
  },

  data: () => ({
    isFocus: false,
    errorMessage: ""
  }),

  computed: {
    isErred(): boolean {
      return !!this.errorMessage
    },

    trimmedValue(): string {
      return this.value.trim()
    }
  },

  mounted() {
    if (this.focusOnMount) this.focus()
  },

  methods: {
    handleIconClick(side: "right" | "left"): void {
      this.$emit(`${side}-icon-click`)
      this.focus()
    },

    validate(): void {
      const trimmedValue = this.value.trim()
      if (!this.notRequired || (this.notRequired && trimmedValue.length > 0)) {
        if (!trimmedValue) return this.setError("This field can't be empty.")
        if (trimmedValue.length > this.maxLength)
          return this.setError(
            `The value can't be more than ${this.maxLength} characters long.`
          )
        if (trimmedValue.length < this.minLength)
          return this.setError(
            `The value can't be less than ${this.minLength} characters long.`
          )
        if (this.pattern && !trimmedValue.match(this.pattern))
          return this.setError(this.invalidPatternMessage)
      }
      return this.clearError()
    },

    onFocus(): void {
      this.isFocus = true
    },
    onBlur(): void {
      this.isFocus = false
    },

    focus(): void {
      document.getElementById(this.identifier)?.focus()
    },

    onInput(e: HTMLInputEvent): void {
      if (this.isErred) this.clearError()
      this.$emit("input", e.target.value)
    },

    clear() {
      this.$emit("input", "")
    },

    setError(message: string): void {
      this.errorMessage = message
    },
    clearError(): void {
      this.errorMessage = ""
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.input-wrapper
  +pos-r
  +tran

  .input
    +size(100% 45px)
    +pa(10px)
    +clr-txt
    +clr-bg(input-background)
    +tran
    +input-search-reset
    +br-md
    +focus-effect(input)
    +fnt-base
    +brdr(input-border)

  &--has-label
    +mt(15px)

  .label
    +tran
    +center-v
    +pos-a(left 10px)
    +clr-txt
    +fnt-medium
    +no-select
    opacity: 0.6

  &--hover-label
    .label
      top: -10px
      left: 5px !important
      opacity: 1
      +fnt-xs

  &--has-error
    +mb(15px)
    .label
      +clr-txt(error)

    .input
      +clr(error, border-color)

  .error
    +pos-a(left 10px top 50px)
    +clr-txt(error)
    +fnt-xs

  &--has-left-icon
    .label
      left: 50px

  @each $side in right left
    .icon--#{$side}
      +center-v
      #{$side}: 12px

    &--has-#{$side}-icon
      .input
        padding-#{$side}: 50px
</style>
