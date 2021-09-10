<template>
  <input-text
    ref="input"
    v-bind="{
      identifier,
      value,
      placeholder,
      hint,
      label,
      minLength,
      maxLength,
      notRequired,
      pattern,
      noAutocomplete,
      focusOnMount,
      invalidPatternMessage
    }"
    :name="name || identifier"
    :type="!isShown ? 'password' : 'text'"
    @input="$emit('input', $event)"
    @right-icon-click="isShown = !isShown"
    left-icon="key"
    :right-icon="isShown ? 'eye-closed' : 'eye'"
    is-right-icon-clickable
  />
</template>

<script lang="ts">
import Vue from "vue"
import { ExtendVueRefs } from "~/@types"

type InputText = Vue & { validate: () => void; errorMessage: string }

export default (Vue as ExtendVueRefs<{ input: InputText }>).extend({
  props: {
    value: { type: String, required: true },
    identifier: { type: String, default: "password" },
    name: { type: String },
    placeholder: { type: String, default: "*********" },
    hint: { type: String },
    label: { type: String, default: "Password" },
    minLength: { type: Number, default: 8 },
    maxLength: { type: Number, default: 150 },
    pattern: { type: RegExp },
    invalidPatternMessage: { type: String },
    notRequired: { type: Boolean, default: false },
    noAutocomplete: { type: Boolean, default: false },
    focusOnMount: { type: Boolean, default: false }
  },

  data: () => ({ isShown: false }),

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
