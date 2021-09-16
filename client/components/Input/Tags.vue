<template>
  <div
    class="input-tags"
    :class="{
      'input-tags--hover-label': shouldHoverLabel,
      'input-tags--has-label': !!label,
      'input-tags--has-error': isErred,
      'input-tags--has-icon': !!icon
    }"
    :id="identifier"
  >
    <glass-card
      class="input-tags__body"
      tint="background-tertiary"
      no-back-shape
      :opacity="0.4"
      :blur="5"
      clickable
      @click="focusOnSearch"
    >
      <icon
        :name="icon"
        size="28px"
        class="input-tags__icon"
        :fill="isErred ? 'error' : undefined"
      />

      <span v-if="label" class="input-tags__label">{{ label }}</span>

      <transition-group name="chips" class="chips">
        <chip-tag
          class="chips__chip"
          v-for="tag in selectedTags"
          :key="tag.id"
          :tag="tag"
          @remove-tag="removeTag"
        />
      </transition-group>

      <input
        type="text"
        ref="searchInput"
        class="input-tags__input"
        :placeholder="shouldHoverLabel ? 'search tags...' : ''"
        v-model="query"
        @focus="onFocus"
        @blur="onBlur"
      />
    </glass-card>

    <transition name="fade">
      <span v-if="isErred" class="error">{{ errorMessage }}</span>
    </transition>

    <transition name="slide-down">
      <glass-card
        v-if="query || (isFocus && !query)"
        class="dropdown"
        tint="background-tertiary"
        border-radius="none"
        no-back-shape
        :opacity="0.8"
        :blur="5"
      >
        <button-main
          class="create"
          v-if="query.length > 1"
          :disabled="!couldCreate"
          block
          cta
          @click="createTag"
          :is-loading="isLoadingCreating"
          >Create "{{ query }}"</button-main
        >
        <div
          class="tag"
          v-for="tag in query ? searchResult : tags"
          :key="tag.id"
          :style="{ '--color': `var(--clr-${tag.color})` }"
          :class="{ 'tag--selected': value.id === value }"
          tabindex="0"
          @click="selectTag(tag)"
          @keyup.space="selectTag(tag)"
          @keyup.enter="selectTag(tag)"
        >
          <span class="tag__color"></span>
          <div class="tag__name">{{ tag.tag }}</div>
        </div>
      </glass-card>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import Fuse from "fuse.js"
import { FormField, Tag, ExtendVueRefs, AddTag } from "~/@types"

type TagId = string
interface Refs {
  searchInput: { focus: () => void }
}

export default (Vue as ExtendVueRefs<Refs>).extend({
  props: {
    identifier: { type: String, required: true },
    value: { type: Array as PropType<TagId[]>, required: true },
    label: { type: String, default: "Tags" },
    required: { type: Boolean, default: false },
    icon: { type: String, default: "tags" }
  },

  data: () => ({
    formFields: [] as FormField[],
    tags: [] as Tag[],
    isFocus: false,
    isLoadingCreating: false,
    query: "",
    errorMessage: ""
  }),

  computed: {
    tagsFuse(): Fuse<Tag> {
      return new Fuse(this.tagsToView, { keys: ["tag"] })
    },

    isErred(): boolean {
      return !!this.errorMessage
    },

    shouldHoverLabel(): boolean {
      return this.isFocus || !!this.query || !!this.value.length
    },

    couldCreate(): boolean {
      const { query } = this
      return !!query && this.tags.findIndex(x => x.tag === query) === -1
    },

    selectedTags(): Tag[] {
      const { tags } = this
      // @ts-ignore
      return this.value.map(tagId => {
        const tagsFound = tags.find(x => x && x.id === tagId)
        return tagsFound
      })
    },

    searchResult(): Tag[] {
      return this.tagsFuse.search(this.query).map(x => x.item)
    },

    tagsToView(): Tag[] {
      const selectedTags = this.value
      return this.tags.filter(
        x => selectedTags.findIndex(y => y === x.id) === -1
      )
    }
  },

  async created() {
    const { data } = await this.$axios.get("/tags")
    this.tags = data
  },

  methods: {
    async createTag() {
      try {
        this.clearError()
        const tag: AddTag = { tag: this.query, color: "pink" }
        this.isLoadingCreating = true
        const response = await this.$axios.post("/tags", tag)
        const createdTag = response.data as Tag
        this.tags.push(createdTag)
        this.selectTag(createdTag)
      } catch (e) {
        this.clearQuery()
        this.setError(e.response.data.message)
      } finally {
        this.isLoadingCreating = false
      }
    },

    setError(message: string) {
      this.errorMessage = message
    },

    clearError() {
      this.setError("")
    },

    removeTag(tag: Tag) {
      this.$emit(
        "input",
        this.value.filter(x => x !== tag.id)
      )
    },

    focusOnSearch() {
      this.$refs.searchInput.focus()
    },
    onFocus() {
      this.isFocus = true
    },
    onBlur() {
      this.isFocus = false
    },

    selectTag(tag: Tag) {
      this.clearQuery()
      this.clearError()
      this.$emit("input", [...this.value, tag.id])
      this.focusOnSearch()
    },

    clearQuery() {
      this.query = ""
    },
    validate() {
      if (this.required && this.value.length === 0)
        this.setError("You have to select at least one tag")
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.input-tags
  +pos-r

  +m(has-label)
    +mt(15px)

  +m(has-icon)
    .input-tags
      +e(body)
        ::v-deep > .glass__body
          +pl(50px)
      +e(label)
        left: 50px

      +e(icon)
        +center-v
        left: 12px

  +e(label)
    +tran
    +center-v
    +pos-a(left 10px)
    +clr-txt
    +fnt-medium
    +no-select
    opacity: 0.6

  +m(hover-label)
    .input-tags__label
      top: -10px
      left: 5px !important
      opacity: 1
      +fnt-xs

  +e(body)
    +zi(selector)
    +w(100%)
    +tran
    ::v-deep > .glass__body
      +tran
      +h(min 45px)
      +pa(10px 20px)

  +e(input)
    +inline-block
    +w(min 75px)
    +h(max 25px)
    +fnt-sm
    +input-reset-appearance
    +brdr(none)
    +clr-bg(none)
    +clr-txt
    &:focus
      outline: none
      +brdr(none)

  .chips
    +e(chip)
      +my(2px)
      +mr(4px)

  .dropdown
    +pos-a
    top: calc(100% - 3px)
    +w(100%)
    +zi(selector-dropdown)

    ::v-deep .glass__body
      +pa(10px 20px)
      +br-b-md
      +h(max 200px)
      overflow: hidden auto
      +scroll

    .create
      +my(8px)

    .tag
      +pos-r
      +pa(8px 10px)
      +br-md
      +clickable
      +tran
      +focus-effect(input-select, focus hover)
      &:not(:last-child)
        +mb(2px)

      +e(color)
        +center-v
        +clr-bg(--color)
        +size(20px)
        +br-sm

      +e(name)
        +pl(35px)

  .error
    +pos-a(left 10px top 50px)
    +clr-txt(error)
    +fnt-xs

  +m(has-error)
    +mb(15px)
    .input-tags__label
      +clr-txt(error)
</style>
