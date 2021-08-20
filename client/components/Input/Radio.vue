<template>
  <div class="radio-wrapper" :class="{ 'radio-wrapper--has-error': isErred }">
    <component v-if="heading" :is="headingTag" class="radio-wrapper__heading">
      {{ heading }}
    </component>

    <div class="radio-wrapper__options">
      <div v-for="option in options" :key="option.value" class="option">
        <span
          class="option__radio"
          :class="{ 'option__radio--is-checked': option.id === value }"
          tabindex="0"
          :aria-labelledby="option.id"
          role="radio"
          :aria-checked="option.id === value ? 'true' : 'false'"
          @click="changeRadio(option)"
          @keyup.space="changeRadio(option)"
          @keydown.space.prevent
        >
        </span>
        <label
          class="option__label"
          :id="option.id"
          @click="changeRadio(option)"
        >
          {{ option.value }}
        </label>
      </div>
    </div>
    <transition name="fade">
      <box v-if="isErred" tag="span" class="error">{{ errorMessage }}</box>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

interface OptionType {
  id: string
  value: string
}

export default Vue.extend({
  props: {
    notRequired: { type: Boolean, default: false },
    value: { type: String },
    heading: { type: String },
    headingTag: { type: String, default: "h3" },
    options: {
      type: Array as PropType<OptionType[]>,
      required: true
    }
  },

  data: () => ({
    errorMessage: ""
  }),

  computed: {
    isErred(): boolean {
      return !!this.errorMessage
    }
  },

  methods: {
    async changeRadio(option: OptionType) {
      if (this.isErred) this.clearError()
      this.$emit("input", option.id)
      this.focusOnRadio(option.id)
    },

    focusOnRadio(id: string) {
      const label = document.getElementById(id) as HTMLElement
      ;(
        label?.previousElementSibling as HTMLElement & { focus: () => void }
      )?.focus()
    },

    validate() {
      this.clearError()
      if (
        !this.notRequired &&
        (this.value === "" || this.value === undefined || this.value === null)
      )
        this.errorMessage = "This field can't be empty."
    },

    clearError() {
      this.errorMessage = ""
    },

    clear() {
      this.$emit("input", "")
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

$radio-size: 20px

.radio-wrapper
  +tran
  +pos-r
  &__heading
    +clr-txt(primary, 70)
    +tran(color, 0.1s)
  &__options
    display: grid
    gap: 10px
    .option
      +pos-r
      +list-reset
      &__label
        +clickable
        +no-select
        +ml($radio-size + 5)
        +tran(color, 0.1s)
      &__radio
        display: inline-block
        +center-v
        +clr-bg
        +size($radio-size)
        +br-cr
        +brdr(input-checkbox)
        +clickable
        +focus-effect
        &:after
          content: ""
          +center
          +size(0)
          +clr-bg(input-checkbox)
          +br-cr
          +tran(all, 0.1s)
        &--is-checked
          &:after
            +size($radio-size - 10px)

  .error
    +pos-a(left 25px bottom -20px)
    +clr-txt(error)
    +fnt-xs
    line-height: 10px

  &--has-error
    +mb(30px)
    .radio-wrapper__heading
      +clr-txt(error)
    .option
      &__label
        +clr-txt(error)
      &__radio
        +clr(error, border-color)
</style>
