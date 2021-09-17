<template>
  <div
    class="input-password"
    :class="{
      'input-password--has-oauth': hasOAuth,
      'input-password--has-error': isErred
    }"
  >
    <input-text
      v-if="!isOAuth"
      ref="input"
      class="input-password__text"
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
      @input="onInput"
      @right-icon-click="isShown = !isShown"
      :left-icon="noIcon ? undefined : 'key'"
      :right-icon="isShown ? 'eye-closed' : 'eye'"
      is-right-icon-clickable
    />

    <input-select
      v-if="isOAuth"
      ref="input"
      class="input-password__select"
      label="OAuth password"
      v-bind="{ identifier, value }"
      @input="onInput"
      primary-key="app"
      :options="[{ id: '33', app: 'facebook' }]"
    />

    <button-base
      v-if="hasOAuth"
      class="input-password__oauth-button"
      @click="toggleOAuth"
    >
      {{ isOAuth ? "Insert password?" : "Connect with another account?" }}
    </button-base>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { ExtendVueRefs, InputText } from "~/@types"

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
    focusOnMount: { type: Boolean, default: false },
    noIcon: { type: Boolean, default: false },
    hasOAuth: { type: Boolean, default: false }
  },

  data: () => ({ isShown: false, isOAuth: false, isErred: false }),

  computed: {
    // Needed for form generator
    errorMessage(): string {
      return this.$refs.input.errorMessage
    }
  },

  methods: {
    updateIsErred() {
      const { input } = this.$refs
      this.setIsErred(input.isErred)
    },

    setIsErred(value: boolean) {
      this.isErred = value
    },

    validate() {
      const { input } = this.$refs
      input.validate()
      this.updateIsErred()
    },

    onInput(value: string) {
      this.$emit("input", value)
      this.updateIsErred()
    },

    toggleOAuth() {
      this.isOAuth = !this.isOAuth
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.input-password
  +pos-r

  +m(has-oauth)
    +mb(28px)
    &.input-password--has-error
      +mb(55px)
      .input-password__oauth-button
        bottom: -25px

  +e(oauth-button)
    +center-h
    bottom: 0
    transform: translate(-50%, 100%)
    opacity: 0.8
    +w(max-content)
    +fnt-sm
    +br-md
</style>
