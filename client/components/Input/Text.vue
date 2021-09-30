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
    <glass-card
      tint="background-tertiary"
      no-back-shape
      :opacity="0.4"
      :blur="5"
      border-radius="md"
      class="input-glass"
    >
      <div>
        <input
          :id="identifier"
          class="input"
          @focus="onFocus"
          @blur="onBlur"
          :type="type"
          :name="name || identifier"
          :placeholder="placeholderValue"
          :autocomplete="noAutocomplete ? 'off' : 'on'"
          :value="value"
          @input="onInput"
        />
      </div>
    </glass-card>

    <label v-if="label" :for="identifier" class="label">
      {{ label }}
      <span v-if="notRequired" class="label__optional">(optional)</span>
    </label>

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
        @keyup:enter="handleIconClick(side)"
        @keyup:space="handleIconClick(side)"
        size="28px"
        :clickable="
          (side === 'left' && isLeftIconClickable) ||
          (side === 'right' && isRightIconClickable)
        "
        :focusable="
          (side === 'left' && isLeftIconClickable) ||
          (side === 'right' && isRightIconClickable)
        "
        :class="`icon icon--${side}`"
        :fill="!!errorMessage ? 'error' : undefined"
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
    default: { type: String },

    name: { type: String },
    type: { type: String, default: "text" },
    placeholder: { type: String },
    hint: { type: String },
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
    },
    placeholderValue(): string {
      if (!this.label) {
        return this.placeholder
      }

      if (this.isFocus) {
        if (this.placeholder) return this.placeholder
        if (this.hint) return `eg. ${this.hint}`
      }
      return ""
    }
  },

  created() {
    if (this.default)
      this.onInput({ target: { value: this.default } } as HTMLInputEvent)
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

  *
    +fnt(input)

  .input-glass
    > div
      +size(100% 45px)
      +br-md

  .input
    +clr-bg(none)
    +size(100%)
    +br-md
    +brdr(none)
    +pa(10px 20px)
    +tran
    +input-search-reset
    +focus-effect(input, focus focus-visible)

  +m(has-label)
    +mt(15px)

  .label
    +tran
    +center-v
    left: 10px
    +clr-txt
    +fnt-medium
    +no-select
    opacity: 0.6
    +e(optional)
      +fnt-xs
      +tran

  +m(hover-label)
    .label
      top: -10px
      left: 5px !important
      opacity: 1
      +fnt-xs
      +e(optional)
        opacity: 0

  +m(has-error)
    +mb(15px)
    .label
      +clr-txt(error)

    .input
      +clr(error, border-color)

  .error
    +pos-a(left 10px top 50px)
    +clr-txt(error)
    +fnt-xs

  +m(has-left-icon)
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
