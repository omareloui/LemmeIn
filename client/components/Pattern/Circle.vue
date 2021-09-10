<template>
  <div
    class="pattern-circle"
    :style="{
      'background-color': `hsl(var(--clr-${color}))`,
      width: size,
      height: size
    }"
  ></div>
</template>


<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    color: { type: String, default: "pink" },
    size: { type: String, default: "100px" }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.pattern-circle
  +br-cr
</style>
