<template>
  <div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  head() {
    return {
      htmlAttrs: {
        theme: this.$accessor.theme.currentTheme === "dark" ? "dark" : undefined
      } as { theme?: string }
    }
  },

  beforeMount() {
    this.$accessor.theme.loadMediaQuery()
  }
})
</script>
