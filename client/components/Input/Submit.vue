<template>
  <button-base
    type="submit"
    class="submit"
    is-cta
    is-large
    @keyup.enter="$emit('enter')"
    v-bind="{ isLoading }"
  >
    <slot>Submit</slot>
  </button-base>
</template>

<script lang="ts">
// import Vue from "vue"

// export default Vue.extend({
//   props: {
//     isLoading: { type: Boolean, default: false }
//   }
// })
</script>
