<template>
  <div class="add-note">
    <h2 class="add-note__heading">Add Note</h2>
    <form-generator
      :form-fields="formFields"
      submit-button-text="Create Note"
      :submit-function="addNote"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import type { FormField, AddNote } from "~/@types"

export default Vue.extend({
  data: () => ({
    formFields: [
      {
        id: "title",
        type: "text",
        label: "Title",
        value: "",
        props: {
          minLength: 2,
          notRequired: true
        }
      },
      {
        id: "body",
        type: "textarea",
        label: "Note",
        value: "",
        props: {
          minLength: 2,
          rows: 10,
          focusOnMount: true,
          notRequired: true
        }
      },
      {
        id: "tags",
        type: "tags",
        value: [],
        props: { leftIcon: "", notRequired: true }
      }
    ] as FormField[]
  }),

  methods: {
    async addNote(options: AddNote) {
      const succeeded = await this.$accessor.notes.addNote(options)
      if (succeeded) this.$emit("close-dialogue")
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.add-note
  +pa(55px 30px)

  +e(heading)
    +clr-txt(primary)
    +center-text
    +fnt-5xl
</style>
