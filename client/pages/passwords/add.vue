<template>
  <container>
    <template #heading>add password</template>
    <box tag="main">
      <form-generator
        v-bind="{ formFields }"
        :submitFunction="submit"
      ></form-generator>
    </box>
  </container>
</template>

<script lang="ts">
import Vue from "vue"

type AcceptableValues = string | string[] | File[]
type Value = { fieldId: string; value: AcceptableValues }

export default Vue.extend({
  async asyncData({ $axios, error }) {
    try {
      const { data: passwords } = await $axios.get("/passwords")
      return { passwords }
    } catch (e) {
      return error(e)
    }
  },

  data: () => ({
    formFields: [
      { id: "title", type: "text", value: "", label: "title" },
      {
        id: "password",
        type: "password",
        value: "",
        label: "password",
        props: { minLength: 2 }
      }
    ]
  }),

  methods: {
    async submit(values: Value[]) {
      try {
        await this.$axios.post("/passwords", values)
        this.$notify.success("Add passwords successfully")
        this.$router.push("/passwords")
      } catch (e) {
        throw new Error(e.response.data)
      }
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
