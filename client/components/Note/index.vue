<template>
  <glass-card
    class="note"
    tint="background-secondary"
    no-back-shape
    focusable
    clickable
    float
    @click="goToNote"
    @dblclick="goToNote"
    @keyup:space="goToNote"
    @keyup:enter="goToNote"
  >
    <div>
      <div v-if="note.title" class="note__title">{{ note.title }}</div>
      <marked :content="note.body.slice(0, 550)" class="note__body" />
      <splitter class="note__splitter" v-if="hasTags" />
      <div class="note__tags" v-if="hasTags">
        <chip-tag
          v-for="tag in note.tags"
          :key="tag.id"
          v-bind="{ tag }"
          no-remove-button
          invert
          clickable
        />
      </div>
    </div>
  </glass-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { Note } from "~/@types"

export default Vue.extend({
  props: {
    note: { type: Object as PropType<Note> }
  },

  computed: {
    hasTags(): boolean {
      return this.note.tags && this.note.tags.length > 0
    }
  },

  methods: {
    goToNote() {
      this.$router.push(`/notes/${this.note.id}`)
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.note
  > div
    +br-md
    +pt(20px)
    +clickable
    overflow: hidden

    *:not(.note__splitter)
      +px(20px)

  +e(title)
    +fnt(heading)
    +fnt-2xl
    +mb(15px)

  +e(body)
    +clr-txt(main, $opacity: 0.8)
    +h(max 200px)
    +pb(10px)
    +tran(color)
    +pos-r
    overflow: hidden
    &:after
      --clr: hsl(var(--clr-hs-background-secondary) var(--clr-l-background-secondary) / var(--clr-o-50))
      content: ""
      +pos-a(bottom 0 left 0)
      +block
      +size(100% 60%)
      +tran($duration: 100ms)
      +no-select
      +not-clickable

      background-image: linear-gradient(transparent, var(--clr))
    &:hover:after
      +h(100%)
      background-image: linear-gradient(transparent 0, var(--clr) 70%)

  +e(tags)
    +flex($gap: 10px 15px, $center-v: true)
    +w(max 600px)
    +mx(auto)
    +py(20px)
</style>
