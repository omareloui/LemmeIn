<template>
  <div>
    {{ tag }}
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import type { Tag } from "~/@types"

export default Vue.extend({
  props: {
    tag: { type: Object as PropType<Tag>, required: true }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
