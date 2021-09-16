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
import { FormField, AddPassword, Password } from "~/@types"

export default Vue.extend({
  data: () => ({
    formFields: [
      {
        id: "app",
        type: "text",
        value: "",
        label: "App or Website",
        props: { hint: "Facebook" }
      },
      {
        id: "password",
        type: "password",
        value: ""
      },
      {
        id: "tags",
        type: "tags",
        value: []
      }
    ] as FormField[]
  }),

  methods: {
    async addPassword(options: AddPassword) {
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
