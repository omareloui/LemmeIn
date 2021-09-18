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
import { ExtendVueRefs } from "~/@types"

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
      type: Function as PropType<
        (query: string) => Array<string | number | Record<string, string>>
      >,
      default(query: string) {
        const propsData = this.$options.propsData as {
          searchKeys: string | string[]
          searchElements: Array<string | number | Record<string, string>>
        }
        if (
          !query ||
          !propsData ||
          !propsData.searchElements ||
          propsData.searchElements.length === 0
        )
          return []

        const isObj = !!(typeof propsData.searchElements[0] === "object")

        if (!isObj) {
          const fuse = new Fuse(propsData.searchElements)
          return fuse.search(query).map(x => x.item)
        }

        if (!propsData.searchKeys || propsData.searchKeys.length === 0)
          throw new Error("You have to provide search key(s)")

        const keys = Array.isArray(propsData.searchKeys)
          ? propsData.searchKeys
          : [propsData.searchKeys]
        const fuse = new Fuse(propsData.searchElements, { keys })
        return fuse.search(query).map(x => x.item)
      }
    },
    searchKeys: { type: [String, Array] },
    searchElements: { type: Array }
  },

  computed: {
    isSearching() {
      return !!this.value
    }
  },

  mounted() {
    window.addEventListener("keyup", this.onKeyUp)
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.onKeyUp)
  },

  methods: {
    onInput(value: string) {
      this.$emit("input", value)
      this.search(value)
    },

    search(query: string) {
      try {
        this.$emit(
          "search-result",
          (this.searchFunction as (query: string) => unknown[])(query)
        )
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
