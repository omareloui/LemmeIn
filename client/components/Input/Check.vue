<template>
  <div
    class="checker-wrapper"
    :class="{ 'checker-wrapper--has-error': isErred }"
  >
    <component v-if="heading" :is="headingTag" class="checker-wrapper__heading">
      {{ heading }}
    </component>
    <div class="checker-wrapper__options">
      <div v-for="option in options" :key="option.value" class="option">
        <span
          class="option__checkbox"
          :class="{ 'option__checkbox--is-checked': option.isChecked }"
          tabindex="0"
          :aria-labelledby="option.id"
          role="checkbox"
          :aria-checked="option.isChecked ? 'true' : 'false'"
          @click="changeCheckbox(option)"
          @keyup.space="changeCheckbox(option)"
          @keydown.space.prevent
        >
          <transition name="scale-out">
            <icon
              v-if="option.isChecked"
              name="check"
              fill="hsla(var(--clr-light))"
              class="option__checkbox-icon"
              size="15px"
            ></icon>
          </transition>
        </span>
        <label
          class="option__label"
          :id="option.id"
          @click="changeCheckbox(option)"
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

export interface OptionType {
  id: string
  value: string
  isChecked: boolean
}

export default Vue.extend({
  props: {
    value: { type: Array },
    notRequired: { type: Boolean, default: false },
    heading: { type: String },
    headingTag: { type: String, default: "h3" },
    options: {
      type: Array as PropType<OptionType[]>,
      required: true,
      validator: options => {
        let isValid = true
        for (let i = 0; i < options.length; i++) {
          const x = options[i]
          const checkForProp = (prop: string) =>
            Object.prototype.hasOwnProperty.call(x, prop)
          isValid =
            checkForProp("id") &&
            checkForProp("value") &&
            checkForProp("isChecked")
          if (!isValid) return false
        }
        return isValid
      }
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
    changeCheckbox(option: OptionType) {
      if (this.isErred) this.clearError()
      option.isChecked = !option.isChecked
      this.$emit("input", this.getChecked())
      this.focusOnCheckbox(option.id)
    },

    focusOnCheckbox(id: string) {
      const label = document.getElementById(id) as HTMLElement
      ;(
        label?.previousElementSibling as HTMLElement & { focus: () => void }
      )?.focus()
    },

    getChecked() {
      return this.options.filter(x => x.isChecked).map(x => x.id)
    },

    clear() {
      this.options.forEach(x => {
        x.isChecked = false
      })
      this.$emit("input", [])
    },

    validate() {
      if (!this.notRequired && this.value?.length === 0)
        this.errorMessage = "This field can't be empty."
    },

    clearError() {
      this.errorMessage = ""
    }
  }
})
</script>

<style lang="sass" scoped>
// @use "~/assets/scss/mixins" as *

// $checker-size: 20px

// .checker-wrapper
//   +tran
//   +pos-r
//   &__heading
//     +clr-txt(primary, 70)
//     +tran(color, 0.1s)
//   &__options
//     display: grid
//     gap: 10px
//     .option
//       +pos-r
//       &__label
//         +clickable
//         +no-select
//         +ml($checker-size + 5px)
//         +tran(color, 0.1s)
//       &__checkbox
//         display: inline-block
//         +clr-bg
//         +center-v
//         +size($checker-size)
//         +br-sm
//         +brdr(input-checkbox)
//         +clickable
//         +focus-effect
//         +tran(all, 0.1s)
//         &--is-checked
//           +clr-bg(input-checkbox)
//   .error
//     +pos-a(left 25px bottom -20px)
//     +clr-txt(error)
//     +fnt-xs
//     line-height: 10px

//   &--has-error
//     +mb(30px)
//     .checker-wrapper__heading
//       +clr-txt(error, 70)
//     .option
//       &__label
//         +clr-txt(error)
//       &__checkbox
//         +clr(error, border-color)
</style>
