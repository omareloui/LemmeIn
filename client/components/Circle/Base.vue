<template>
  <div
    class="circle"
    :style="{ '--clr': `var(--clr-${color})`, '--size': size }"
  ></div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    color: { type: String, required: true },
    size: { type: String, required: true }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.circle
  +br-cr
  +clr-bg(--clr)
  +size(var(--size))
</style>
