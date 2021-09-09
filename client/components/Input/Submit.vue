<template>
  <button-main
    type="submit"
    class="submit"
    cta
    large
    block
    @keyup.enter="$emit('enter')"
    v-bind="{ isLoading }"
  >
    <slot>Submit</slot>
  </button-main>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    isLoading: { type: Boolean, default: false }
  }
})
</script>
