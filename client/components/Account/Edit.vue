<template>
  <div class="edit-account">
    <h2 class="edit-account__heading">
      Update
      <span class="edit-password__heading-tag-name">“{{ app }}”</span>
      Account
    </h2>
    <form-generator
      :form-fields="formFields"
      submit-button-text="Update Account"
      :submit-function="editAccount"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import {
  FormStructure,
  AddAccountReceivedData,
  UpdateAccount,
  Account
} from "~/@types"

export default Vue.extend({
  props: {
    id: { type: String, required: true },
    app: { type: String, required: true },
    isNative: { type: Boolean, required: true },
    password: {
      type: [Object, String] as PropType<Account | string>,
      required: true
    },
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
      const { app, accountIdentifier, note, site, tags, password, isNative } =
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
          value: (isNative ? password : (password as Account).id) as string,
          props: {
            noIcon: true,
            minLength: 3,
            hasOAuth: true,
            showPasswordStrength: true,
            isOAuthDefault: !isNative
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
            notRequired: true,
            pattern:
              // eslint-disable-next-line no-useless-escape
              /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
            invalidPatternMessage: "The link has to be a valid url"
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

    async editAccount({
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
        isNative: password.isNative,
        accountIdentifier,
        site,
        note,
        tags
      }
      try {
        const newAccount = await this.$accessor.vault.editAccount(options)
        this.$emit("edit-account", newAccount)
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

.edit-account
  +pa(55px 30px)

  +e(heading)
    +clr-txt(primary)
    +center-text
    +fnt-5xl
    +mb(5px)

  +e(heading-tag-name)
    +break-word
</style>
