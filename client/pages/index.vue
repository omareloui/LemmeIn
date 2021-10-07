<template>
  <container tag="main">
    <template #heading>Lemme in</template>
  </container>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  layout: "no-floating-menu",

  // @ts-ignore
  middleware({ $accessor, redirect }) {
    if ($accessor.auth.isSigned) redirect("/home")
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
