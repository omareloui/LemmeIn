<template>
  <div
    class="input-password"
    :class="{
      'input-password--has-oauth': hasOAuth && hasOtherPasswords,
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
      v-if="isOAuth && hasOtherPasswords"
      ref="input"
      class="input-password__select"
      label="OAuth password"
      v-bind="{ identifier, value }"
      @input="onInput"
      primary-key="app"
      defaultButtonText="Select a password"
      :options="$accessor.vault.passwords"
      is-searchable
    />

    <password-strength
      v-if="showPasswordStrength && !isOAuth"
      class="input-password__strength"
      line-height="10px"
      hide-score-text
      :decrypted-password="value"
    />

    <button-base
      v-if="hasOAuth && hasOtherPasswords"
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
    hasOAuth: { type: Boolean, default: false },
    showPasswordStrength: { type: Boolean, default: false }
  },

  data: () => ({
    isShown: false,
    isOAuth: false,
    isErred: false
  }),

  async beforeCreate() {
    await this.$accessor.vault.getPasswords()
  },

  computed: {
    // Needed for form generator
    errorMessage(): string {
      return this.$refs.input.errorMessage
    },

    hasOtherPasswords(): boolean {
      return this.$accessor.vault.passwords.length > 0
    }
  },

  methods: {
    getInput(): InputText {
      return this.$refs.input as InputText
    },

    updateIsErred() {
      this.setIsErred(this.getInput().isErred)
    },

    setIsErred(value: boolean) {
      this.isErred = value
    },

    validate() {
      this.getInput().validate()
      this.updateIsErred()
    },

    onInput(value: string) {
      this.$emit("input", value)
      this.updateIsErred()
    },

    clearInput() {
      this.onInput("")
    },

    clearError() {
      this.getInput().clearError()
      this.updateIsErred()
    },

    toggleOAuth() {
      this.isOAuth = !this.isOAuth
      this.clearInput()
      this.clearError()
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.input-password
  +pos-r

  +m(has-oauth)
    +mb(34px)

  +m(has-error)
    +e(input-password, strength)
      +mt(30px)

  +e(oauth-button)
    +center-h
    bottom: -6px
    transform: translate(-50%, 100%)
    opacity: 0.8
    +w(max-content)
    +fnt-sm
    +br-md

  +e(strength)
    +my(10px)
</style>
