<template>
  <container no-heading custom-max-width="600px">
    <form-generator
      :form-fields="
        isSignin ? signinFields : registerFields.concat(signinFields)
      "
      :submit-function="isSignin ? signin : register"
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
  },

  methods: {
    async register(values: { [fieldId: string]: unknown }) {
      const { data: result } = await this.$axios.post("/auth/register", values)
      this.$accessor.auth.setSignData(result)
      this.$router.push("/")
    },

    async signin(values: { [fieldId: string]: unknown }) {
      const { data: result } = await this.$axios.post("/auth/login", {
        email: values.email,
        password: values.password
      })
      this.$accessor.auth.setSignData(result)
      this.$router.push("/")
    }
  }
})
</script>
