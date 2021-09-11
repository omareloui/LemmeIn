<template>
  <container>
    <template #heading>Sign up</template>
    <form-sign />
  </container>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  layout: "no-floating-menu"
})
</script>
