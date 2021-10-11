<template>
  <input-text
    ref="input"
    v-bind="{
      identifier,
      value,
      placeholder,
      hint,
      label,
      minLength,
      maxLength,
      pattern,
      noAutocomplete,
      focusOnMount,
      invalidPatternMessage
    }"
    :name="name || identifier"
    type="search"
    @input="onInput"
    @right-icon-click="clear"
    left-icon="search"
    :right-icon="isSearching ? 'close-circled' : null"
    not-required
  />
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import Fuse from "fuse.js"
import { debounce } from "lodash"
import { ExtendVueRefs } from "~/@types"

type SearchFunc = (
  query: string
) => Array<string | number | Record<string, string>>

interface Refs {
  input: Vue & { clear: () => void; focus: () => void }
}

export default (Vue as ExtendVueRefs<Refs>).extend({
  props: {
    value: { type: String, required: true },
    identifier: { type: String, default: "search" },
    name: { type: String },
    placeholder: { type: String, default: "Search" },
    hint: { type: String },
    label: { type: String, default: "" },
    minLength: { type: Number, default: 0 },
    maxLength: { type: Number, default: 150 },
    pattern: { type: RegExp },
    invalidPatternMessage: { type: String },
    noAutocomplete: { type: Boolean, default: true },
    focusOnMount: { type: Boolean, default: false },

    searchFunction: {
      type: Function as PropType<SearchFunc>,
      default(query: string) {
        const { searchKeys, searchElements } = this.$options.propsData as {
          searchKeys: string | string[]
          searchElements: Array<string | number | Record<string, string>>
        }
        if (!query || !searchElements || searchElements.length === 0) return []

        const fuseOptions: { keys?: string[] } = {}

        const isObj = !!(typeof searchElements[0] === "object")
        if (isObj) {
          fuseOptions.keys = Array.isArray(searchKeys)
            ? searchKeys
            : [searchKeys]
        }

        const fuse = new Fuse(searchElements, fuseOptions)

        if (!searchKeys || searchKeys.length === 0)
          throw new Error("You have to provide search key(s)")

        return fuse.search(query).map(x => x.item)
      }
    },
    searchKeys: { type: [String, Array] },
    searchElements: { type: Array },

    debouncingDuration: { type: Number, default: 200 },

    listenForSlash: { type: Boolean, default: false }
  },

  computed: {
    isSearching() {
      return !!this.value
    }
  },

  mounted() {
    if (this.listenForSlash) window.addEventListener("keyup", this.onKeyUp)
    this.debouncedSearch ||= debounce(this.search, this.debouncingDuration)
    if (this.value) this.onInput(this.value)
  },
  beforeDestroy() {
    if (this.listenForSlash) window.removeEventListener("keyup", this.onKeyUp)
  },

  data: () => ({
    debouncedSearch: null as null | ((query: string) => void)
  }),

  methods: {
    onInput(value: string) {
      if (this.debouncedSearch) this.debouncedSearch(value)
    },

    updateInput(value: string) {
      this.$emit("input", value)
    },

    search(query: string) {
      try {
        this.updateInput(query)
        this.$emit("search-result", (this.searchFunction as SearchFunc)(query))
      } catch (e) {
        this.$notify.error("No search key provided.")
      }
    },

    onKeyUp(e: KeyboardEvent) {
      if (e.code === "Slash") this.focusOnSearch()
    },
    focusOnSearch() {
      this.focus()
    },

    focus() {
      this.$refs.input.focus()
    },

    clear() {
      this.$emit("clear")
      this.focus()
    }
  }
})
</script>
