<template>
  <container>
    <template #heading> Signin </template>
    <container no-heading custom-max-width="600px">
      <form-generator v-bind="{ formFields }" :submit-function="signin" />
    </container>
  </container>
</template>

<script lang="ts">
import Vue from "vue"
import { FormField } from "~/components/Form/Generator.vue"

export default Vue.extend({
  data: () => ({
    formFields: [
      { id: "email", type: "email", value: "" },
      { id: "password", type: "password", value: "" }
    ] as FormField[]
  }),

  methods: {
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

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
