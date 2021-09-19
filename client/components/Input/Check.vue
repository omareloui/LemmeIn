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
        <glass-card
          class="option__checkbox"
          :class="{ 'option__checkbox--is-checked': option.isChecked }"
          role="checkbox"
          :aria="{
            'aria-labelledby': option.id,
            'aria-checked': option.isChecked ? 'true' : 'false'
          }"
          focusable
          @click="changeCheckbox(option)"
          @keyup:space="changeCheckbox(option)"
          tint="background-tertiary"
          back-shape="circle"
          :back-shape-color="
            isErred
              ? 'error'
              : option.isChecked
              ? 'success'
              : 'background-tertiary'
          "
          float
          center-content
        >
          <div>
            <transition name="input-check">
              <icon
                v-if="option.isChecked"
                name="check"
                class="option__checkbox-icon"
                size="20px"
              ></icon>
            </transition>
          </div>
        </glass-card>
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
      <span v-if="isErred" class="error">{{ errorMessage }}</span>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import type { InputCheckOption } from "~/@types"

export default Vue.extend({
  props: {
    value: { type: Array },
    notRequired: { type: Boolean, default: false },
    heading: { type: String },
    headingTag: { type: String, default: "h3" },
    options: {
      type: Array as PropType<InputCheckOption[]>,
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
    },
    mustHaveOneAtLeast: { type: Boolean, default: false }
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
    changeCheckbox(option: InputCheckOption) {
      if (this.isErred) this.clearError()
      const hasOneTrue = !!this.options.find(x => x !== option && x.isChecked)
      if (this.mustHaveOneAtLeast && !hasOneTrue)
        this.$notify.error("Must have at least one selected")
      else {
        option.isChecked = !option.isChecked
        this.$emit("input", this.getChecked())
        this.focusOnCheckbox(option.id)
      }
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
@use "~/assets/scss/mixins" as *

$checker-size: 20px

.checker-wrapper
  +pos-r
  +tran
  +e(heading)

  +e(options)
    +auto-fit(100px, $gap: 20px, $center: false)

  .option
    +grid($center-h: true)
    +pa(10px)
    +e(checkbox)
      +pos-r
      +mb(10px)
      +clickable
      +size(35px)
      +br-md
      > div
        +size(100%)
    +e(checkbox-icon)
      +center-inset
    +e(label)
      +clickable
      +center-text

  .error
    +pos-a(left 25px bottom -20px)
    +clr-txt(error)
    +fnt-xs
    line-height: 10px

  +m(has-error)
    +mb(30px)
    .checker-wrapper__heading
      +clr-txt(error)
    .option
      +e(label)
        +clr-txt(error)
</style>
