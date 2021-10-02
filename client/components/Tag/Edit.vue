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
      const succeeded = await this.$accessor.tags.updateTag({
        ...options,
        id: this.tag.id
      })
      if (succeeded) this.$emit("close-dialogue")
    },

    async removeTag() {
      const succeeded = await this.$accessor.tags.deleteTag({
        tagId: this.tag.id,
        tagName: this.tag.name
      })
      if (succeeded) this.$emit("close-dialogue")
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
