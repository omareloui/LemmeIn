<template>
  <container
    padding-bottom
    no-heading
    class="note"
    :class="{
      'note--no-heading': !note.title,
      'note--no-body': !note.body,
      'note--is-editing': isEditing
    }"
  >
    <!-- Edit button -->
    <transition name="fade">
      <button-base
        v-if="!isEditing"
        class="note__edit-button"
        @click="openEditing"
      >
        <icon name="edit" />
      </button-base>
      <button-base v-if="isEditing" class="note__edit-button" @click="cancel">
        <icon name="close" />
      </button-base>
    </transition>

    <!-- Title -->
    <h1 v-if="!isEditing && note.title" class="note__title">
      {{ note.title }}
    </h1>
    <input-minimal-text
      v-if="isEditing"
      ref="headingInput"
      is-textarea
      class="note__title"
      placeholder="Title"
      v-model="editData.title"
    />

    <marked
      v-if="!isEditing && note.body"
      class="note__body"
      :content="note.body"
    />
    <input-minimal-text
      v-if="isEditing"
      ref="bodyInput"
      is-textarea
      class="note__body"
      placeholder="Note"
      v-model="editData.body"
    />

    <splitter class="note__splitter" />

    <div class="note__tags" v-if="hasTags && !isEditing">
      <chip-tag
        v-for="tag in note.tags"
        :key="tag.id"
        v-bind="{ tag }"
        no-remove-button
        invert
      />
    </div>

    <div v-if="isEditing" class="note__tags--edit">
      <input-tags identifier="tags" v-model="editData.tags" left-icon="" />
    </div>

    <div v-if="!isEditing" class="dates">
      <span
        class="dates__wrapper"
        @mouseenter="showCreatedAt = true"
        @mouseleave="showCreatedAt = false"
      >
        <transition name="note-dates">
          <span class="dates__created" v-if="showCreatedAt">
            Created {{ $moment(note.createdAt).fromNow() }}
          </span>
        </transition>

        <span class="dates__edit">
          Edited {{ $moment(note.updatedAt).fromNow() }}
        </span>
      </span>
    </div>

    <div v-if="isEditing" class="note__edit-buttons">
      <button-main large cta block @click="save" :is-loading="isSaving"
        >Save</button-main
      >
      <button-main
        large
        block
        color="danger"
        :is-loading="isDeleting"
        @click="deleteNote"
        >Delete Note</button-main
      >
    </div>
  </container>
</template>

<script lang="ts">
import Vue from "vue"
import { ExtendVue, Note } from "~/@types"

interface InputMinimalText {
  focus: () => Promise<void>
}

interface Refs {
  headingInput: InputMinimalText
  bodyInput: InputMinimalText
}

export default (Vue as ExtendVue<{ note: Note; $refs: Refs }>).extend({
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

  mounted() {
    window.addEventListener("keyup", this.onKeyup)
  },

  beforeDestroy() {
    window.removeEventListener("keyup", this.onKeyup)
  },

  computed: {
    hasTags(): boolean {
      return !!this.note.tags && this.note.tags.length > 0
    }
  },

  data() {
    return {
      showCreatedAt: false,

      isEditing: false,
      isSaving: false,
      isDeleting: false,
      editData: {} as { title: string; body: string; tags: string[] }
    }
  },

  methods: {
    setEditData() {
      this.editData = {
        title: this.note.title || "",
        body: this.note.body || "",
        tags: this.note.tags ? this.note.tags.map(x => x.id) : []
      }
    },

    async openEditing() {
      this.isEditing = true
      await this.$nextTick()
      this.$refs.bodyInput.focus()
    },
    closeEditing() {
      this.isEditing = false
    },

    async save() {
      this.isSaving = true
      const { $accessor } = this
      const { title, body, tags } = this.editData
      const newNote = await $accessor.notes.updateNote({
        id: this.note.id,
        title,
        body,
        tags
      })
      if (newNote) {
        this.note = newNote
        this.closeEditing()
      }
      this.isSaving = false
    },

    cancel() {
      this.closeEditing()
      this.setEditData()
    },

    async deleteNote() {
      this.isDeleting = true
      const deleted = await this.$accessor.notes.deleteNote(this.note.id)
      if (deleted) this.$router.push("/notes")
      this.isDeleting = false
    },

    onKeyup(e: KeyboardEvent) {
      if (this.isEditing && e.code === "Escape") this.cancel()
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.note
  +pos-r

  +m(no-heading)
    &:not(.note__is-editing)
      +mt(50px)

  +e(edit-button)
    +pos-a(top 0 right 20px)

  +e(title)
    +fnt-7xl
    +fnt-bold
    +fnt(heading)
    +w(max 100%)
    +break-word

  +e(body)
    +fnt-lg
    +mt(20px)
    +break-word

  +e(splitter)
    +my(10px)

  +e(tags)
    +flex($gap: 10px 15px, $center-v: true)
    +w(max 600px)
    +mx(auto)

    +m(edit)
      +mt(30px)

  .dates
    +fnt-xs
    +clr-txt(main, $opacity: 0.8)
    +flex
    justify-content: flex-end

    +e(wrapper)
      +pos-r
    +e(created)
      +pos-a(bottom 0 left 50%)
      +inline-block
      +w(max-content)
      transform: translate(-50%, 100%)
      +br-sm
      +pa(3px 5px)
      +clr-bg(secondary)

  +e(edit-buttons)
    +grid(1fr, $gap: 30px, $center: true)
    +mt(20px)
    +lt-mobile
      gap: 10px
      grid-template-columns: 1fr 1fr
</style>
