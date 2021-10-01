<template>
  <div class="add-account">
    <h2 class="add-account__heading">Add Account</h2>
    <form-generator
      :form-fields="formFields"
      submit-button-text="Save Account"
      :submit-function="addAccount"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { FormStructure, AddAccount, AddAccountReceivedData } from "~/@types"

export default Vue.extend({
  props: {
    password: { type: String, default: "" }
  },

  created() {
    this.setFormFields()
  },

  data: () => ({
    formFields: [] as FormStructure
  }),

  methods: {
    setFormFields() {
      const { password } = this

      this.formFields = [
        {
          id: "app",
          type: "text",
          value: "",
          label: "App or Website",
          props: { hint: "Facebook", focusOnMount: true }
        },
        {
          id: "password",
          type: "password",
          value: password,
          props: {
            default: password,
            noIcon: true,
            minLength: 3,
            hasOAuth: true,
            showPasswordStrength: true
          }
        },
        {
          expandableFields: [
            "gap",
            {
              id: "accountIdentifier",
              type: "text",
              value: "",
              label: "Account identifier",
              props: {
                placeholder: "email or username",
                notRequired: true
              }
            },
            {
              id: "site",
              type: "text",
              label: "Link",
              value: "",
              props: {
                hint: "https://google.com",
                notRequired: true
              }
            },
            {
              id: "tags",
              type: "tags",
              value: [],
              props: { leftIcon: "" }
            },
            {
              id: "note",
              type: "textarea",
              label: "Note",
              value: "",
              props: { notRequired: true }
            }
          ]
        }
      ]
    },

    async addAccount({
      app,
      password,
      accountIdentifier,
      site,
      note,
      tags
    }: AddAccountReceivedData) {
      const options: AddAccount = {
        app,
        password: password.value,
        isOAuth: password?.isOAuth,
        accountIdentifier,
        site,
        note,
        tags
      }
      try {
        this.$accessor.vault.addAccount(options)
        this.$emit("close-dialogue")
      } catch (e) {
        this.$notify.error(e.response.data.message)
      }
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.add-account
  +pa(55px 30px)

  +e(heading)
    +clr-txt(primary)
    +center-text
    +fnt-5xl
</style>
