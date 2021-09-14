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
        id: "tag",
        type: "text",
        label: "Tag name",
        value: "",
        props: {
          minLength: 2,
          hint: "social_media",
          pattern: /^[^\s!@#$%^&=.,*-+`~|:;?"'/\\[\](){}<>]+$/,
          invalidPatternMessage:
            "You can't use spaces or special characters in the tag"
        }
      },
      { id: "color", type: "color", value: "" }
    ] as FormField[]
  }),

  methods: {
    async addTag(options: AddTag) {
      try {
        const { data: newTag } = await this.$axios.post("/tags", options)
        this.$notify.success("Created tag.")
        this.$emit("add-tag", newTag)
        this.$emit("close-dialogue")
      } catch (e) {
        this.$notify.error(e.response.data.message)
      }
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
</style>
