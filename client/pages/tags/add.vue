<template>
  <container>
    <template #heading>add tag</template>
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
      const { data: tags } = await $axios.get("/tags")
      return { tags }
    } catch (e) {
      return error(e)
    }
  },

  data: () => ({
    formFields: [{ id: "tag", type: "text", value: "", label: "tag" }]
  }),

  methods: {
    async submit(values: Value[]) {
      try {
        await this.$axios.post("/tags", values)
        this.$notify.success("Add tag successfully")
        this.$router.push("/tags")
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
