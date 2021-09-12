<template>
  <div>
    <the-navbar />
    <nuxt />
    <notify />
    <floating-menu />

    <dialogue>
      <password-generator />
    </dialogue>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  beforeMount() {
    this.$accessor.theme.loadSetTheme()
  }
})
</script>
