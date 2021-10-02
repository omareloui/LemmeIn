<template>
  <div class="update-tag">
    <h2 class="update-tag__heading">
      Edit
      <span class="update-tag__heading-tag-name">“{{ tag.name }}”</span> Tag
    </h2>
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
          id: "name",
          type: "text",
          label: "Tag name",
          value: "",
          props: {
            minLength: 2,
            default: this.tag.name,
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
        const confirmed = await this.$confirm(
          `Are you sure you want to delete "${this.tag.name}" tag?`,
          { acceptMessage: "Delete" }
        )
        if (!confirmed) return
        await this.$axios.delete(`/tags/${this.tag.id}`)
        this.$notify.success("Removed tag.")
        this.$emit("remove-tag", this.tag)
        this.$emit("close-dialogue")
      } catch (e) {
        this.$notify.error(e.response ? e.response.data.message : e.message)
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

  +e(heading-tag-name)
    word-break: break-word

  +e(remove)
    +mt(40px)
</style>
