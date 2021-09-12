<template>
  <div>
    <the-navbar />
    <nuxt />
    <notify />
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
