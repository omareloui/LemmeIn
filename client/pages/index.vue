<template>
  <container tag="main">
    <template #heading>Lemme in</template>
    <icons-preview />
  </container>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  layout: "no-floating-menu"
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
