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
    noAutocomplete: { type: Boolean, default: false },
    focusOnMount: { type: Boolean, default: false },

    searchFunction: {
      type: Function as PropType<
        (query: string) => Array<string | number | Record<string, string>>
      >,
      default(query: string) {
        const propsData = this.$options.propsData as {
          searchKey: string | undefined
          searchElements: Array<string | number | Record<string, string>>
        }
        if (
          !query ||
          !propsData ||
          !propsData.searchElements ||
          propsData.searchElements.length === 0
        )
          return []

        const queryRegExp = new RegExp(query, "i")
        const result = propsData.searchElements.filter(x => {
          if (typeof x === "object") {
            if (!propsData.searchKey) throw new Error("No search key provided!")
            return x[propsData.searchKey].match(queryRegExp)
          }
          if (typeof x === "number") return x.toString().match(queryRegExp)
          return x.match(queryRegExp)
        })
        if (result.length === 0) return []
        return result
      }
    },
    searchKey: { type: String },
    searchElements: { type: Array }
  },

  computed: {
    isSearching() {
      return !!this.value
    }
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
