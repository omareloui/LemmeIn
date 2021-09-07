<template>
  <div
    class="input-file-wrapper"
    :class="{ 'input-file-wrapper--has-error': isErred }"
  >
    <component
      v-if="heading"
      :is="headingTag"
      class="input-file-wrapper__heading"
    >
      {{ heading }}
    </component>
    <div class="input-file-wrapper__button">
      <label
        class="input-label"
        :for="identifier"
        tabindex="0"
        @keyup.space="chooseFile"
        @keydown.space.prevent
        role="button"
        :aria-label="`${acceptImagesOnly ? 'Image' : 'File'} Upload`"
      >
        {{ label }}
      </label>
      <input
        :id="identifier"
        ref="inputFile"
        class="input-field"
        type="file"
        @change="updateSelected"
        :accept="computedAcceptFiles"
        :multiple="isMulti"
      />

      <transition name="fade">
        <box v-if="isErred" tag="span" class="error">{{ errorMessage }}</box>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { ExtendVueRefs, HTMLInputEvent } from "~/@types"

interface Refs {
  inputFile: HTMLInputElement
}

export default (Vue as ExtendVueRefs<Refs>).extend({
  props: {
    value: { type: Array as PropType<File[]> },
    notRequired: { type: Boolean, default: false },
    label: { type: String, default: "Select file" },
    isMulti: { type: Boolean, default: false },
    acceptFiles: { type: String, default: "*" },
    acceptImagesOnly: { type: Boolean, default: false },
    identifier: { type: String, default: "file" },
    dontKeepPrevious: { type: Boolean, default: false },
    heading: { type: String },
    headingTag: { type: String, default: "h3" }
  },

  data() {
    return {
      errorMessage: ""
    }
  },

  computed: {
    computedAcceptFiles(): string {
      return this.acceptImagesOnly
        ? "image/png,image/jpg,image/jpeg,image/svg+xml"
        : this.acceptFiles
    },

    isErred(): boolean {
      return !!this.errorMessage
    }
  },

  methods: {
    chooseFile() {
      this.$refs.inputFile.click()
    },

    updateSelected(e: HTMLInputEvent) {
      if (this.isErred) this.clearError()
      if (!e.target || !e.target.files) {
        if (!this.dontKeepPrevious) return this.$emit("input", this.value)
        return this.$emit("input", [])
      }

      let files
      if (!this.isMulti) {
        files = [Array.from(e.target.files)[0]]
      } else if (!this.dontKeepPrevious) {
        files = [...this.value, ...Array.from(e.target.files)]
      } else {
        files = Array.from(e.target.files)
      }
      return this.$emit("input", files)
    },

    removeFile(fileIndex: number) {
      if (!this.isMulti) return this.$emit("input", [])
      return this.$emit(
        "input",
        this.value.filter((_x, i) => i !== fileIndex)
      )
    },

    clear() {
      this.$emit("input", [])
    },

    validate() {
      if (!this.notRequired && this.value.length === 0)
        this.errorMessage = "This field is required"
    },

    clearError() {
      this.errorMessage = ""
    }
  }
})
</script>

<style lang='sass' scoped>
// @use "~/assets/scss/mixins" as *

// .input-file-wrapper
//   +tran
//   +pos-r
//   &__heading
//     +clr-txt(primary,  70)
//     +tran(color, 0.1s)
//   .input-label
//     +clickable
//     +clr-bg(primary, 90)
//     +clr-txt(invert)
//     +pa(5px 10px)
//     +br-md
//     +focus-effect
//     display: inline-block
//   .input-field
//     display: none

//   .error
//     +pos-a(left 25px bottom -20px)
//     +clr-txt(error)
//     +fnt-xs
//     line-height: 10px

//   &--has-error
//     +mb(30px)
//     .input-label
//       +clr-bg(error)
//     .input-file-wrapper__heading
//       +clr-txt(error)
</style>
