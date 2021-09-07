<template>
  <container>
    <template #heading> Sign up </template>
    <container no-heading custom-max-width="600px">
      <form-generator v-bind="{ formFields }" :submit-function="register" />
    </container>
  </container>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  data: () => ({
    formFields: [
      { id: "firstName", type: "text", label: "First Name", value: "" },
      { id: "lastName", type: "text", label: "Last Name", value: "" },
      { id: "email", type: "email", value: "" },
      { id: "password", type: "password", value: "" }
    ]
  }),
  methods: {
    async register(values: { [fieldId: string]: unknown }) {
      const { data: result } = await this.$axios.post("/auth/register", values)
      this.$accessor.auth.setSignData(result)
      this.$router.push("/")
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
