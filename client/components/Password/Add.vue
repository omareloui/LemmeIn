<template>
  <div class="add-password">
    <h2 class="add-password__heading">Add Password</h2>
    <form-generator
      :form-fields="formFields"
      submit-button-text="Save Password"
      :submit-function="addPassword"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import {
  FormStructure,
  AddPassword,
  Password,
  AddPasswordReceivedData
} from "~/@types"

export default Vue.extend({
  data: () => ({
    formFields: [
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
        value: "",
        props: { noIcon: true, hasOAuth: true }
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
              hing: "https://google.com",
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
    ] as FormStructure
  }),

  methods: {
    async addPassword({
      app,
      password,
      accountIdentifier,
      site,
      note,
      tags
    }: AddPasswordReceivedData) {
      const options: AddPassword = {
        app,
        password: password.value,
        isOAuth: password?.isOAuth,
        accountIdentifier,
        site,
        note,
        tags
      }
      try {
        const response = await this.$axios.post("/passwords", options)
        const password = response.data as Password
        this.$notify.success("Created password.")
        this.$emit("add-password", password)
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

.add-password
  +pa(55px 30px)

  +e(heading)
    +clr-txt(primary)
    +center-text
    +fnt-5xl
</style>
