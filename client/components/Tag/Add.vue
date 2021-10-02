<template>
  <div class="add-tag">
    <h2 class="add-tag__heading">Add Tag</h2>
    <form-generator
      :form-fields="formFields"
      submit-button-text="Create Tag"
      :submit-function="addTag"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import type { FormField, AddTag } from "~/@types"

export default Vue.extend({
  data: () => ({
    tagName: "",
    color: "",
    formFields: [
      {
        id: "name",
        type: "text",
        label: "Tag name",
        value: "",
        props: {
          minLength: 2,
          hint: "social_media",
          pattern: /^[^\s!@#$%^&=.,*-+`~|:;?"'/\\[\](){}<>]+$/,
          invalidPatternMessage:
            "You can't use spaces or special characters in the tag",
          focusOnMount: true
        }
      },
      { id: "color", type: "tag-color", value: "" }
    ] as FormField[]
  }),

  methods: {
    async addTag(options: AddTag) {
      const succeeded = await this.$accessor.tags.addTag(options)
      if (succeeded) this.$emit("close-dialogue")
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.add-tag
  +pa(55px 30px)

  +e(heading)
    +clr-txt(primary)
    +center-text
    +fnt-5xl
</style>
