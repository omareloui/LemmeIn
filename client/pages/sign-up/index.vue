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
import { FormField } from "~/components/Form/Generator.vue"

export default Vue.extend({
  layout: "no-floating-menu",

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
      { id: "password", type: "password", value: "" }
    ] as FormField[]
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
