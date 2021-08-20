<template>
  <container>
    <template #heading>{{ password.title }}</template>
    <box tag="main">
      {{ password }}
    </box>
    <button-base @click="deletePassword" is-cta width="200px">
      delete password
    </button-base>
  </container>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  async asyncData({ $axios, params: { passwordId }, error }) {
    try {
      const { data: password } = await $axios.get(`/passwords/${passwordId}`)
      return { password }
    } catch (e) {
      return error(e)
    }
  },

  methods: {
    async deletePassword() {
      try {
        await this.$axios.delete(`/passwords/${this.$route.params.passwordId}`)
        this.$router.push("/passwords")
        this.$notify.success("Deleted password successfully")
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
