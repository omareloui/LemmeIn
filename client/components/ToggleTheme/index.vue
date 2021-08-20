<template>
  <box>
    <box>cookie theme: {{ $cookies.get("theme") }}</box>
    <box>store theme: {{ $accessor.theme.currentTheme }}</box>
    <box> doc element theme: {{ getDocTheme() || "light" }} </box>
    <button-base @click="toggleTheme">toggle theme</button-base>
  </box>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  methods: {
    toggleTheme() {
      this.$accessor.theme.toggleTheme()
    },

    getDocTheme() {
      return document.documentElement.getAttribute("theme")
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
