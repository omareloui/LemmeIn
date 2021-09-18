<template>
  <div
    class="input-tags"
    :class="{
      'input-tags--hover-label': shouldHoverLabel,
      'input-tags--has-label': !!label,
      'input-tags--has-error': isErred,
      'input-tags--has-icon': !!leftIcon
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
      <div tabindex="0">
        <icon
          v-if="leftIcon"
          :name="leftIcon"
          size="28px"
          class="icon"
          :fill="isErred ? 'error' : undefined"
        />

        <span v-if="label" class="label">
          {{ label }}
          <span v-if="notRequired" class="label__optional">(optional)</span>
        </span>

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
          class="input"
          :placeholder="shouldHoverLabel ? 'search tags...' : ''"
          v-model="query"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>
    </glass-card>

    <transition name="fade">
      <span v-if="isErred" class="error">{{ errorMessage }}</span>
    </transition>

    <transition name="slide-down">
      <glass-card
        v-if="query.length > 1 || (isFocus && tagsToView.length > 0)"
        class="dropdown"
        tint="background-tertiary"
        border-radius="none"
        no-back-shape
        :opacity="0.4"
        :blur="5"
      >
        <div>
          <transition name="fade">
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
          </transition>
          <transition-group name="input-select-search" tag="div">
            <div
              class="tag"
              v-for="tag in query ? searchResult : tagsToView"
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
          </transition-group>
        </div>
      </glass-card>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import Fuse from "fuse.js"
import { FormField, Tag, ExtendVueRefs, AddTag } from "~/@types"
import getRandomColor from "~/assets/utils/getRandomTagColor"

type TagId = string
interface Refs {
  searchInput: { focus: () => void }
}

export default (Vue as ExtendVueRefs<Refs>).extend({
  props: {
    identifier: { type: String, required: true },
    value: { type: Array as PropType<TagId[]>, required: true },
    label: { type: String, default: "Tags" },
    notRequired: { type: Boolean, default: true },
    leftIcon: { type: String, default: "tags" }
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
        const tag: AddTag = { tag: this.query, color: getRandomColor() }
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
      if (!this.notRequired && this.value.length === 0)
        this.setError("You have to select at least one tag")
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.input-tags
  +pos-r

  .label
    +tran
    +center-v
    +pos-a(left 10px)
    +clr-txt
    +fnt-medium
    +no-select
    opacity: 0.6
    +e(optional)
      +fnt-xs
      +tran

  +e(body)
    +zi(selector)
    > div
      +pa(10px 20px)
      +pos-r
      +focus-effect(input)
      +w(100%)
      +h(min 45px)
      +br-md
      +brdr(none)
      +clickable

  .input
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

  +m(has-label)
    +mt(15px)

  +m(has-icon)
    .label
      left: 50px
    .input-tags
      +e(body)
        > div
          +pl(50px)
          .icon
            +center-v
            left: 12px

  +m(hover-label)
    .label
      top: -10px
      left: 5px !important
      opacity: 1
      +fnt-xs
      +e(optional)
        opacity: 0

  // Map
  // glass-card.dropdown
  //   div
  //     button-main.create
  //     div.tag
  //       span.tag__color
  //       div.tag__name

  .dropdown
    +pos-r
    +zi(selector-dropdown)
    > div
      +pos-a(top 5px)
      +pa(10px)
      +w(100%)
      +h(max 200px)
      +no-scroll
      +br-md
      +brdr(none)
      overflow-x: auto

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
    +pos-a(left 10px bottom 0)
    transform: translateY(100%)
    +clr-txt(error)
    +fnt-xs

  +m(has-error)
    +mb(15px)
    +e(input-tags, label)
      +clr-txt(error)
</style>
