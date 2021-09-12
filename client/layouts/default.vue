<template>
  <div>
    <the-navbar />
    <nuxt />
    <notify />
    <floating-menu />
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  beforeMount() {
    this.$accessor.theme.load()
  }
})
</script>
