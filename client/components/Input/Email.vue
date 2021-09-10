<template>
  <input-text
    ref="input"
    v-bind="{
      identifier,
      value,
      placeholder,
      hint,
      label,
      notRequired,
      noAutocomplete,
      focusOnMount
    }"
    :name="name || identifier"
    type="text"
    @input="$emit('input', $event)"
    :min-length="5"
    :max-length="150"
    :pattern="/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/"
    invalid-pattern-message="This has to be a valid email address."
    left-icon="mail"
  />
</template>

<script lang="ts">
import Vue from "vue"
import { ExtendVueRefs } from "~/@types"

type InputText = Vue & { validate: () => void; errorMessage: string }

export default (Vue as ExtendVueRefs<{ input: InputText }>).extend({
  props: {
    value: { type: String, required: true },
    identifier: { type: String, default: "email" },
    name: { type: String },
    placeholder: { type: String },
    hint: { type: String, default: "john.doe@examplemail.com" },
    label: { type: String, default: "Email" },
    notRequired: { type: Boolean, default: false },
    noAutocomplete: { type: Boolean, default: false },
    focusOnMount: { type: Boolean, default: false }
  },

  computed: {
    // Needed for form generator
    errorMessage(): string {
      return this.$refs.input.errorMessage
    }
  },

  methods: {
    // Needed for form generator
    validate() {
      this.$refs.input.validate()
    }
  }
})
</script>
