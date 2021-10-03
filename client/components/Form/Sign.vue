<template>
  <container no-heading custom-max-width="600px">
    <form-generator
      :form-fields="
        isSignin ? signinFields : registerFields.concat(signinFields)
      "
      :submit-function="
        isSignin ? $accessor.auth.signin : $accessor.auth.register
      "
    />
  </container>
</template>

<script lang="ts">
import Vue from "vue"
import { FormField } from "~/@types"

export default Vue.extend({
  data: () => ({
    signinFields: [
      { id: "email", type: "email", value: "" },
      { id: "password", type: "password", value: "" }
    ] as FormField[],

    registerFields: [
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
      }
    ] as FormField[]
  }),

  computed: {
    isSignin(): boolean {
      return this.$route.fullPath === "/signin"
    }
  }
})
</script>
