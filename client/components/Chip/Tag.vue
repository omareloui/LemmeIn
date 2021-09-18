<template>
  <div class="chip-tag" :style="{ '--color': `var(--clr-${tag.color})` }">
    {{ tag.tag }}
    <button-glass
      class="remove-button"
      size="25px"
      icon-size="10px"
      icon="close"
      color="cancel"
      @click="$emit('remove-tag', tag)"
    ></button-glass>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { Tag } from "~/@types"

export default Vue.extend({
  props: {
    tag: { type: Object as PropType<Tag>, required: true }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.chip-tag
  +pos-r
  +pa(2px 35px 2px 10px)
  +clr-bg(--color)
  +clr-txt(dark)
  +br-bl
  +inline-block
  +fnt-sm

  .remove-button
    +center-v
    right: 8px
</style>
