<template>
  <div class="icons">
    <icon
      v-for="icon in icons"
      :key="icon.name"
      :name="`app-${icon.name}`"
      :fill="icon.color"
      :view-box="icon.viewBox"
      size="50px"
      :aria-label="icon.name"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import icons from "~/config/icons"

export default Vue.extend({
  data: () => ({
    icons
  })
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.icons
  +auto-fit(50px, $gap: 3px)
</style>
