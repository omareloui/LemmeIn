<template>
  <div class="update-tag">
    <h2 class="update-tag__heading">Edit Tag</h2>
    <form-generator
      class="update-tag__form"
      :form-fields="formFields"
      submit-button-text="Update Tag"
      :submit-function="updateTag"
    />

    <form-generator
      class="update-tag__remove"
      :form-fields="[]"
      submit-button-text="Remove Tag"
      :submit-function="removeTag"
      danger
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import type { FormField, Tag, UpdateTag } from "~/@types"

export default Vue.extend({
  props: {
    tag: { type: Object as PropType<Tag> }
  },

  data() {
    return {
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
            default: this.tag.tag,
            hint: "social_media",
            pattern: /^[^\s!@#$%^&=.,*-+`~|:;?"'/\\[\](){}<>]+$/,
            invalidPatternMessage:
              "You can't use spaces or special characters in the tag",
            focusOnMount: true
          }
        },
        {
          id: "color",
          type: "tag-color",
          value: "",
          props: { default: this.tag.color }
        }
      ] as FormField[]
    }
  },

  methods: {
    async updateTag(options: UpdateTag) {
      try {
        const { data: updatedTag } = await this.$axios.put(
          `/tags/${this.tag.id}`,
          options
        )
        this.$notify.success("Updated tag.")
        this.$emit("update-tag", updatedTag)
        this.$emit("close-dialogue")
      } catch (e) {
        this.$notify.error(e.response.data.message)
      }
    },

    async removeTag() {
      try {
        await this.$axios.delete(`/tags/${this.tag.id}`)
        this.$notify.success("Removed tag.")
        this.$emit("remove-tag", this.tag)
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

.update-tag
  +pa(55px 30px)

  +e(heading)
    +clr-txt(primary)
    +center-text

  +e(remove)
    +mt(40px)
    // ::v-deep .submit
    //   +clr-bg(danger)
</style>
