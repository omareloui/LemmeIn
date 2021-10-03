<template>
  <container padding-bottom>
    <template #heading>Account Settings</template>
    <main>
      <container no-heading custom-max-width="600px">
        <form-generator
          :form-fields="formFields"
          :submit-function="this.$accessor.auth.updateMe"
          submit-button-text="Update Me"
        />
      </container>
    </main>
  </container>
</template>

<script lang="ts">
import Vue from "vue"
import { FormField } from "~/@types"

export default Vue.extend({
  created() {
    this.setDefaults()
  },

  data: () => ({
    formFields: [
      {
        id: "firstName",
        type: "text",
        label: "First Name",
        value: "",
        style: "half"
      },
      {
        id: "lastName",
        type: "text",
        label: "Last Name",
        value: "",
        style: "half"
      },
      { id: "email", type: "email", value: "" },
      {
        id: "oldPassword",
        label: "Old password",
        type: "password",
        value: "",
        props: { placeholder: "Leave empty to not update", notRequired: true }
      },
      {
        id: "password",
        label: "New password",
        type: "password",
        value: "",
        props: { placeholder: "Leave empty to not update", notRequired: true }
      }
    ] as FormField[]
  }),

  methods: {
    setDefaults() {
      const { user } = this.$accessor.auth
      if (!user) throw new Error("Not signed in!")
      const { firstName, lastName, email } = user
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.formFields.find(f => f.id === "firstName")!.value = firstName
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.formFields.find(f => f.id === "lastName")!.value = lastName
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.formFields.find(f => f.id === "email")!.value = email
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
