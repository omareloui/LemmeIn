<template>
  <container>
    <template #heading>passwords</template>
    <box tag="main">
      <div>{{ passwords }}</div>
      <div class="password" v-for="password in passwords" :key="password._id">
        <link-base :to="`/passwords/${password._id}`">
          {{ password.title }}
        </link-base>
      </div>
      <link-button to="/passwords/add">Add new password</link-button>
    </box>
  </container>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  async asyncData({ $axios, error }) {
    try {
      const { data: passwords } = await $axios.get("/passwords")
      return { passwords }
    } catch (e) {
      return error(e)
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
