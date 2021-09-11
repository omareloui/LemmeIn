<template>
  <container class="error">
    <template #heading>{{ error.status }} {{ error.type }}</template>
    <p class="error__message">{{ error.message }}</p>
  </container>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

interface AxiosError {
  message: string
  name: string
  path: string
  type: string
  status: number
}

export default Vue.extend({
  layout: "no-floating-menu",

  props: {
    error: { type: Object as PropType<AxiosError> }
  }
})
</script>

<style lang="sass" scoped>
// @use "~/assets/scss/mixins" as *

// .error
//   +e(message)
//     +fnt-3xl
//     +center-text
//     +mt(20px)
</style>
