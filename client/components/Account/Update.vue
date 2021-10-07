<template>
  <div class="update-account">
    <h2 class="update-account__heading">
      Update
      <span class="update-password__heading-tag-name">“{{ app }}”</span>
      Account
    </h2>
    <form-generator
      :form-fields="formFields"
      submit-button-text="Update Account"
      :submit-function="updateAccount"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { FormStructure, AddAccountReceivedData, UpdateAccount } from "~/@types"

export default Vue.extend({
  props: {
    id: { type: String, required: true },
    app: { type: String, required: true },
    decryptedPassword: { type: String, required: true },
    accountIdentifier: { type: String },
    note: { type: String },
    site: { type: String },
    tags: { type: Array as PropType<string[]> }
  },

  created() {
    this.setFormFields()
  },

  data: () => ({
    formFields: [] as FormStructure
  }),

  methods: {
    setFormFields() {
      const { app, decryptedPassword, accountIdentifier, note, site, tags } =
        this

      this.formFields = [
        {
          id: "app",
          type: "text",
          value: app,
          label: "App or Website",
          props: { hint: "Facebook", focusOnMount: true }
        },
        {
          id: "password",
          type: "password",
          value: decryptedPassword,
          props: {
            noIcon: true,
            minLength: 3,
            hasOAuth: true,
            showPasswordStrength: true
          }
        },
        "gap",
        {
          id: "accountIdentifier",
          type: "text",
          value: accountIdentifier ?? "",
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
          value: site ?? "",
          props: {
            hint: "https://google.com",
            notRequired: true
          }
        },
        {
          id: "tags",
          type: "tags",
          value: [],
          props: { default: tags, leftIcon: "" }
        },
        {
          id: "note",
          type: "textarea",
          label: "Note",
          value: note ?? "",
          props: { notRequired: true }
        }
      ]
    },

    async updateAccount({
      app,
      password,
      accountIdentifier,
      site,
      note,
      tags
    }: AddAccountReceivedData) {
      const options: UpdateAccount = {
        id: this.id,
        app,
        password: password.value,
        isOAuth: password?.isOAuth,
        accountIdentifier,
        site,
        note,
        tags
      }
      try {
        const newAccount = await this.$accessor.vault.updateAccount(options)
        this.$emit("update-account", newAccount)
        this.$emit("close-dialogue")
      } catch (e) {
        this.$notify.error(e.response ? e.response.data.message : e.message)
      }
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.update-account
  +pa(55px 30px)

  +e(heading)
    +clr-txt(primary)
    +center-text
    +fnt-5xl
    +mb(5px)

  +e(heading-tag-name)
    +break-word
</style>
