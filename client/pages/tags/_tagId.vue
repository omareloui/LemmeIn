<template>
  <container>
    <template #heading>{{ tag.title }}</template>
    <box tag="main">
      {{ tag }}
    </box>
    <button-base @click="deletePassword" cta width="200px">
      delete tag
    </button-base>
  </container>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  async asyncData({ $axios, params: { tagId }, error }) {
    try {
      const { data: tag } = await $axios.get(`/tags/${tagId}`)
      return { tag }
    } catch (e) {
      return error(e.response.data)
    }
  },

  methods: {
    async deletePassword() {
      try {
        await this.$axios.delete(`/tags/${this.$route.params.tagId}`)
        this.$router.push("/tags")
        this.$notify.success("Deleted tag successfully")
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
