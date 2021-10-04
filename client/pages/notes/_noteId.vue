<template>
  <container padding-bottom no-heading class="notes-page">
    <input-minimal-text
      class="note__title"
      :class="{ 'note__title--no-title': !note.title && !focusHeading }"
      contenteditable
      placeholder="Title"
      @focus="focusHeading = true"
      @blur="focusHeading = false"
      v-model="editData.title"
    />
    <input-minimal-text
      is-textarea
      class="note__body"
      contenteditable
      v-model="editData.body"
      @focus="focusBody = true"
      @blur="focusBody = false"
    />
    <splitter class="note__splitter" />
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

    <div class="note__dates">
      <span class="note__create-at">
        Added {{ $moment(note.createdAt).fromNow() }}
      </span>
      <span class="note__updated-at">
        Last update {{ $moment(note.createdAt).fromNow() }}
      </span>
    </div>
  </container>
</template>

<script lang="ts">
import Vue from "vue"
import { ExtendVue, Note } from "~/@types"

export default (Vue as ExtendVue<{ note: Note }>).extend({
  async asyncData({ app, params: { noteId }, error }) {
    try {
      const note = await app.$accessor.notes.getNote(noteId)
      return { note }
    } catch (e) {
      return error(e.response.data)
    }
  },

  created() {
    this.setEditData()
  },

  computed: {
    hasTags(): boolean {
      return this.note.tags && this.note.tags.length > 0
    }
  },

  data() {
    return {
      focusHeading: false,
      focusBody: false,

      editData: {}
    }
  },

  methods: {
    setEditData() {
      this.editData = { title: this.note.title, body: this.note.body }
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.note
  +e(title)
    +fnt-7xl
    +fnt(heading)
    +w(max 100%)

  +e(body)
    +fnt-lg
    +mt(20px)

  +e(splitter)
    +my(20px)
    +h(2px)

  +e(tags)
    +flex($gap: 10px 15px, $center-v: true)
    +w(max 600px)
    +mx(auto)
    +py(10px)

  +e(dates)
    opacity: 0.8
    +fnt-sm
</style>
