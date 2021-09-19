<template>
  <form
    @submit.prevent="onSubmit"
    class="form-generator"
    :class="{
      'form-generator--danger': danger
    }"
  >
    <div class="fields">
      <div
        v-for="(field, index) in topLevelFields"
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
    </div>

    <button-base
      v-if="couldExpand && !isExpandableShown"
      @click="isExpandableShown = true"
      class="expand-button"
    >
      more options
      <icon name="drop" size="15px" />
    </button-base>

    <transition name="slide-down">
      <div v-if="couldExpand && isExpandableShown" class="fields">
        <div
          v-for="(field, index) in expandableFields"
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
      </div>
    </transition>

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
  PasswordValue,
  FormStructure,
  ExpandableFields,
  FormGap,
  InputText,
  InputPassword
} from "~/@types"

export const GAP: FormGap = "gap"

type InputComponent = InputText | InputPassword

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
    isLoading: false,
    isExpandableShown: false
  }),

  computed: {
    couldExpand(): boolean {
      return this.expandableFields.length > 0
    },

    topLevelFields(): (FormField | FormGap)[] {
      // @ts-ignore
      return this.formFields.filter(x => !x.expandableFields) as (
        | FormField
        | FormGap
      )[]
    },

    expandableFields(): (FormField | FormGap)[] {
      return (
        this.formFields
          // @ts-ignore
          .filter(x => !!x.expandableFields)
          .reduce(
            // @ts-ignore
            (acc, field) => [...acc, ...field.expandableFields],
            [] as (FormField | FormGap)[]
          ) as unknown as (FormField | FormGap)[]
      )
    },

    fields(): FormField[] {
      return this.removeGap(
        this.topLevelFields.concat(this.expandableFields)
      ) as FormField[]
    },

    values(): FormValues {
      const result: FormValues = {}
      this.fields.forEach((x: FormField) => {
        // Handle password value if the types is password
        if (x.type === "password") {
          const passwordComponent = this.getInputComponent(x) as InputPassword
          if (passwordComponent.hasOAuth) {
            const passwordResult: PasswordValue = {
              value: x.value as string,
              isOAuth: false
            }
            if (passwordComponent.isOAuth) passwordResult.isOAuth = true
            result[x.id] = passwordResult
          } else result[x.id] = x.value
        }
        // Handle the rest of the fields
        else result[x.id] = x.value
      })
      return result
    },

    components(): InputComponent[] {
      const fieldsToGet = (
        this.isExpandableShown
          ? this.fields
          : this.removeGap(this.topLevelFields)
      ) as FormField[]
      return fieldsToGet.map(this.getInputComponent.bind(this))
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
      const validateInput = (inputComponent: InputComponent) =>
        inputComponent.validate()
      this.components.forEach(validateInput.bind(this))
    },

    checkIfComponentsHaveError() {
      const { components } = this
      for (let i = 0; i < components.length; i++) {
        const inputComponent = components[i]
        if (inputComponent.errorMessage) return true
      }
      return false
    },

    removeGap(fields: FormStructure): (FormField | ExpandableFields)[] {
      return fields.filter(x => x !== GAP) as (FormField | ExpandableFields)[]
    },

    getInputComponent(x: FormField) {
      return (this.$refs[x.id] as InputComponent[])[0]
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.form-generator

  .fields
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
      &:not(.form-field--half),
      &:not(.expandable-field--half)
        grid-column: 1 / 3

  .expand-button
    opacity: 0.8
    +pos-r
    +center-text
    +mx(auto)
    +mb(10px)
    +mt(20px)
    +pr(20px)
    +fnt-sm
    +block
    +br-md
    i
      +center-v
      opacity: 0.8
      right: 0

  .submit
    grid-column: 1 / 3
    +mt(15px)

  +m(danger)
    .submit
      +clr-bg(danger)
</style>
