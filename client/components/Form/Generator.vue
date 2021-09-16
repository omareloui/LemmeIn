<template>
  <form
    @submit.prevent="onSubmit"
    @keydown.enter.prevent
    class="form-generator"
    :class="{
      'form-generator--danger': danger
    }"
  >
    <div
      v-for="(field, index) in formFields"
      :key="index"
      class="form-field"
      :class="{
        'form-field--gap': field === 'gap',
        'form-field--input': field !== 'gap',
        'form-field--half': field.style === 'half'
      }"
    >
      <component
        v-if="field !== 'gap'"
        :is="`input-${field.type}`"
        v-model="field.value"
        :ref="field.id"
        :identifier="field.id"
        :label="field.label"
        v-bind="{ ...field.props }"
      ></component>
    </div>
    <input-submit v-bind="{ isLoading }" @enter="onSubmit" class="submit">
      {{ submitButtonText }}
    </input-submit>
  </form>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import {
  ExtendVueRefs,
  FormField,
  FormValues,
  FormStructure,
  FormGap
} from "~/@types"

export const GAP: FormGap = "gap"

type InputComponent = Vue & { validate: () => void; errorMessage: string }

type SubmitFunction = (values: FormValues) => void

export default (Vue as ExtendVueRefs<Record<string, unknown>>).extend({
  props: {
    formFields: { type: Array as PropType<FormStructure> },
    submitButtonText: { type: String, default: "Submit" },
    submitFunction: {
      type: Function as PropType<SubmitFunction>,
      required: true
    },
    gridLayout: { type: String },
    danger: { type: Boolean, default: false }
  },

  data: () => ({
    isLoading: false
  }),

  computed: {
    fields(): FormField[] {
      return this.formFields.filter(x => x !== GAP) as FormField[]
    },
    values(): FormValues {
      const neededResult: FormValues = {}
      this.fields.forEach((x: FormField) => {
        neededResult[x.id] = x.value
      })
      return neededResult
    }
  },

  methods: {
    async onSubmit() {
      try {
        this.startLoading()
        // Validation
        this.validate()
        await this.$nextTick()
        const hasError = this.checkIfComponentsHaveError()
        if (hasError) return
        await this.submitFunction(this.values)
      } catch (e) {
        if (e.response) this.$notify.error(e.response.data.message)
        else this.$notify.error(e.message)
      } finally {
        this.endLoading()
      }
    },

    startLoading() {
      this.isLoading = true
    },

    endLoading() {
      this.isLoading = false
    },

    validate() {
      const getInputComponent = (x: FormField) =>
        (this.$refs[x.id] as InputComponent[])[0]
      const inputComponents = this.fields.map(getInputComponent.bind(this))
      const validateInput = (inputComponent: InputComponent) =>
        inputComponent.validate()

      inputComponents.forEach(validateInput.bind(this))
    },

    checkIfComponentsHaveError() {
      const getInputComponent = (x: FormField) =>
        (this.$refs[x.id] as InputComponent[])[0]
      const inputComponents = this.fields.map(getInputComponent.bind(this))

      for (let i = 0; i < inputComponents.length; i++) {
        const inputComponent = inputComponents[i]
        if (inputComponent.errorMessage) return true
      }
      return false
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.form-generator
  display: grid
  gap: 15px
  grid-template-columns: 1fr 1fr
  .form-field
    +m(gap)
      height: 0.7rem
      grid-column: 1 / 3

    +m(input)
      grid-column: 1 / 3

    +lt-mobile
      grid-column: unset
      &:not(.form-field--half)
        grid-column: 1 / 3

  .submit
    grid-column: 1 / 3
    +mt(15px)

  +m(danger)
    .submit
      +clr-bg(danger)
</style>
