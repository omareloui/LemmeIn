<template>
  <glass-card
    class="tag"
    tint="background-secondary"
    no-back-shape
    focusable
    clickable
    float
    @click="editTag"
    @dblclick="goToTag"
    @keyup:space="editTag"
    @keyup:enter="editTag"
  >
    <div>
      <span
        class="tag__color"
        :style="{ '--color': `var(--clr-${tag.color})` }"
      ></span>
      <div class="tag__name">{{ tag.tag }}</div>
      <div class="tag__passwords-count">{{ tag.passwordsCount || 0 }}</div>
    </div>
  </glass-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import type { Tag } from "~/@types"

export default Vue.extend({
  props: {
    tag: { type: Object as PropType<Tag>, required: true }
  },

  methods: {
    goToTag() {
      this.$router.push(`/vault?tags=${this.tag.id}`)
    },

    editTag() {
      this.$emit("edit-tag", this.tag)
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.tag
  > div
    +br-md
    +pa(20px)

  +e(color)
    +center-v
    +clr-bg(--color)
    +size(20px)
    +br-sm

  +e(name)
    +pl(35px)

  +e(passwords-count)
    --size: 30px
    +center-v
    +size(min-content var(--size))
    +px(8px)
    +fnt-sm
    +br-md
    +clr-bg(tertiary)
    right: 10px
    line-height: var(--size)
</style>
