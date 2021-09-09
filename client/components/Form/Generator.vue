<template>
  <form @submit.prevent="onSubmit" @keydown.enter.prevent>
    <box v-for="(field, index) in formFields" :key="index">
      <component
        :is="`input-${field.type}`"
        v-model="field.value"
        :ref="field.id"
        :identifier="field.id"
        :label="field.label"
        v-bind="{ ...field.props }"
      ></component>
    </box>
    <input-submit v-bind="{ isLoading }" @enter="onSubmit">
      {{ submitButtonText }}
    </input-submit>
  </form>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { ExtendVueRefs } from "~/@types"

type AcceptableValues = string | string[] | File[]
type Values = { [fieldId: string]: AcceptableValues }
interface FormFieldType {
  id: string
  type: "text" | "email" | "password" | "select" | "radio" | "check" | "file"
  value: AcceptableValues
  label?: string
  props?: Partial<{ notRequired: boolean; leftIcon: string }>
}

type InputComponent = Vue & { validate: () => void; errorMessage: string }

type SubmitFunction = (values: Values) => void

export default (Vue as ExtendVueRefs<Record<string, unknown>>).extend({
  props: {
    formFields: { type: Array as PropType<FormFieldType[]> },
    submitButtonText: { type: String, default: "Submit" },
    submitFunction: {
      type: Function as PropType<SubmitFunction>,
      required: true
    }
  },

  data: () => ({
    isLoading: false
  }),

  computed: {
    values(): Values {
      const neededResult: Values = {}
      this.formFields.forEach((x: FormFieldType) => {
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
        if (hasError) throw new Error("not valid")
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
      const getInputComponent = (x: FormFieldType) =>
        (this.$refs[x.id] as InputComponent[])[0]
      const inputComponents = this.formFields.map(getInputComponent.bind(this))
      const validateInput = (inputComponent: InputComponent) =>
        inputComponent.validate()

      inputComponents.forEach(validateInput.bind(this))
    },

    checkIfComponentsHaveError() {
      const getInputComponent = (x: FormFieldType) =>
        (this.$refs[x.id] as InputComponent[])[0]
      const inputComponents = this.formFields.map(getInputComponent.bind(this))

      for (let i = 1; i < inputComponents.length; i++) {
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

form
  display: grid
  gap: 15px
</style>
