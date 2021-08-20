<template>
  <div
    class="selector"
    :class="{
      'selector--selected': !!value,
      'selector--has-error': isErred,
      'selector--has-label': !!label,
      'selector--hover-label': hoverLabel || !!value,
      'selector--has-left-icon': !!leftIcon
    }"
    tabindex="0"
    @keyup.space="toggleShowOptions"
    @keyup.up="focusPrevOption"
    @keyup.down="focusNextOption"
    @keydown.space.prevent
    @keydown.up.prevent
    @keydown.down.prevent
  >
    <div class="selector__label">{{ label }}</div>

    <div class="selector__button" @click="toggleShowOptions">
      <icon
        :name="leftIcon"
        v-if="!!leftIcon"
        size="28px"
        class="selector__left-icon"
        :fill="
          !!errorMessage ? 'hsl(var(--clr-error))' : 'hsl(var(--clr-dark))'
        "
      />

      <transition name="fade">
        <span
          v-if="hoverLabel || !!value"
          class="selector__button-text"
          :class="{ 'selector__button-text--no-value': !selectedOption }"
        >
          {{
            (selectedOption && selectedOption[primaryKey]) ||
            defaultButtonText ||
            `Select a ${primaryKey}`
          }}
        </span>
      </transition>

      <icon
        name="drop"
        class="selector__button-icon"
        :style="{
          transform: isDropdownOpen
            ? 'translateY(-50%) rotate(180deg)'
            : 'translateY(-50%)',
          fill: isErred ? 'hsl(var(--clr-error))' : 'hsl(var(--clr-dark))'
        }"
      />
    </div>

    <transition name="fade">
      <span v-if="isErred" class="selector__error">{{ errorMessage }}</span>
    </transition>

    <transition name="slide-down">
      <div
        class="dropdown"
        :class="{ 'dropdown--open': isDropdownOpen }"
        v-if="isDropdownOpen"
        :id="identifier"
      >
        <input-search
          v-if="isSearchable"
          ref="searchField"
          class="dropdown__search"
          v-model="searchQuery"
          @clear="clearSearch"
          @search-result="searchResult = $event"
          search-key="gender"
          :search-elements="options"
          no-autocomplete
        />

        <ul class="options">
          <li
            class="option"
            v-for="option in isSearching ? searchResult : options"
            :key="option.id"
            :class="{ 'option--selected': option.id === value }"
            tabindex="0"
            @keyup.up="focusPrevOption"
            @keyup.down="focusNextOption"
            @keyup.space="selectOnSpace"
            @keydown.space.prevent
            @keydown.up.prevent
            @keydown.down.prevent
          >
            <input
              type="radio"
              class="option__input"
              :id="option.id"
              :name="name || identifier"
              :value="option.id"
              @change="select"
            />
            <label
              class="option__label"
              :for="option.id"
              @click="closeDropdown"
            >
              {{ option[primaryKey] }}
            </label>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { ExtendVueRefs, HTMLInputEvent } from "~/@types"

type Option = {
  id: number | string
  [key: string]: string | number
}

interface Refs {
  searchField: HTMLElement & {
    clear: () => void
    value: string
    isSearching: boolean
  }
}

export default (Vue as ExtendVueRefs<Refs>).extend({
  props: {
    identifier: { type: String, required: true },
    name: { type: String },
    primaryKey: { type: String, default: "value" },
    options: {
      type: Array as PropType<Option[]>,
      required: true,
      validator(v) {
        // Make sure the passed options has id
        for (let i = 0; i < v.length; i++) {
          if (!Object.hasOwnProperty.call(v[i], "id")) return false
        }
        return true
      }
    },
    label: { type: String },
    notRequired: { type: Boolean, default: false },
    isSearchable: { type: Boolean, default: false },
    searchFunction: { type: Function },
    value: { type: String, required: true },
    defaultButtonText: { type: String },
    leftIcon: { type: String }
  },

  data() {
    return {
      isDropdownOpen: false,

      searchQuery: "",
      searchResult: [],

      errorMessage: "",
      hoverLabel: false
    }
  },

  computed: {
    isErred(): boolean {
      return !!this.errorMessage
    },

    selectedOption(): Option | undefined {
      return this.options.find(x => x.id === this.value)
    },

    isSearching(): boolean {
      return !!this.searchQuery
    }
  },

  mounted() {
    window.addEventListener("keyup", this.closeDropdownOnEscapeAndTabOnOutFocus)
    // @ts-ignore
    window.addEventListener("click", this.closeDropdownOnClickingAway)
  },

  beforeDestroy() {
    window.removeEventListener(
      "keyup",
      this.closeDropdownOnEscapeAndTabOnOutFocus
    )
    // @ts-ignore
    window.removeEventListener("click", this.closeDropdownOnClickingAway)
  },

  methods: {
    async select(e: HTMLInputEvent) {
      if (this.isErred) this.clearError()
      this.$emit("input", e.target.value)
    },

    selectOnSpace(e: HTMLInputEvent) {
      const inputElement = e.target.querySelector("input")
      if (!inputElement) return
      this.select({ target: { value: inputElement.value } } as HTMLInputEvent)
    },

    clear() {
      this.$emit("input", "")
    },

    validate() {
      if (!this.notRequired) {
        if (!this.value) {
          this.errorMessage = "You have to select something."
          return
        }
      }
      this.clearError()
    },

    clearError() {
      this.errorMessage = ""
    },

    async toggleShowOptions() {
      if (this.isDropdownOpen) this.closeDropdown()
      else this.openDropdown()

      if (!this.isSearchable) return
      this.clearSearch()
      await this.$nextTick()
      this.focusOnSearch()
    },

    async openDropdown() {
      this.isDropdownOpen = true
      this.hoverLabel = true
      await this.$nextTick()
      this.focusOnSelected()
    },

    closeDropdown() {
      this.isDropdownOpen = false
      this.hoverLabel = false
      if (this.isSearchable) this.clearSearch()
    },

    closeDropdownOnClickingAway(e: PointerEvent) {
      const path = e.composedPath() as HTMLElement[]
      const clickedSelectorElement = path?.find((clickedElement: HTMLElement) =>
        clickedElement.classList?.contains("selector")
      )
      if (!clickedSelectorElement) this.closeDropdown()
    },

    closeDropdownOnEscapeAndTabOnOutFocus(e: KeyboardEvent) {
      if (e.code === "Escape") this.closeDropdown()
      if (e.code === "Tab") {
        const elements = e.composedPath()
        const selectorTabbedElement = ([...elements] as HTMLElement[]).find(x =>
          x?.classList?.contains("selector")
        )
        if (!selectorTabbedElement) this.closeDropdown()
      }
    },

    focusPrevOption(e: KeyboardEvent) {
      const target = e.target as Element
      if (!target) return
      const optionsList = this.getOptionsElements()
      if (optionsList.length === 0) return
      const lastElement = optionsList[optionsList.length - 1]
      // If it's the button then select the last element
      if (target.classList.contains("selector")) {
        lastElement.focus()
        return
      }
      const targetIndex = optionsList.indexOf(target as HTMLLIElement)
      if (targetIndex === 0) {
        lastElement.focus()
        return
      }
      optionsList[targetIndex - 1].focus()
    },

    focusNextOption(e: KeyboardEvent) {
      const target = e.target as Element
      if (!target) return
      const optionsList = this.getOptionsElements()
      if (optionsList.length === 0) return
      const firstElement = optionsList[0]
      // If it's the button then select the first element
      if (target.classList.contains("selector")) {
        firstElement.focus()
        return
      }
      const targetIndex = optionsList.indexOf(target as HTMLLIElement)
      if (targetIndex === optionsList.length - 1) {
        firstElement.focus()
        return
      }
      optionsList[targetIndex + 1].focus()
    },

    focusOnSelected() {
      if (!this.value) return
      const optionsList = this.getOptionsElements()
      if (optionsList.length === 0) return
      const selectedElement = optionsList.find(
        x => x.querySelector("input")?.value === this.value
      )
      selectedElement?.focus()
    },

    getOptionsElements() {
      const optionsContainer = document.getElementById(this.identifier)
      if (!optionsContainer) return []
      const list = optionsContainer.querySelector("ul")
      const listItems = list?.querySelectorAll("li")
      if (!listItems) return []
      return Array.from(listItems)
    },

    clearSearch() {
      this.searchQuery = ""
    },

    focusOnSearch() {
      if (this.isSearchable) {
        const { searchField } = this.$refs
        if (searchField && searchField.focus) searchField.focus()
      }
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.selector
  +pos-r
  +br-md
  +focus-effect(input)
  +clr-bg(input-background)
  +brdr(input-border)

  &--has-label
    +mt(15px)

  &__label
    +tran
    +center-v
    +pos-a(left 10px)
    +clr-txt
    +fnt-medium
    +no-select
    opacity: 0.6

  &--hover-label
    .selector__label
      top: -10px
      left: 5px !important
      opacity: 1
      +fnt-xs

  &__error
    +pos-a(left 10px top 50px)
    +clr-txt(error)
    +fnt-xs

  &__button
    +pos-r
    +zi(selector)
    +pa(10px)
    +br-md
    +tran(background-color)
    +clickable
    +h(45px)

  &__button-text
    +center-v
    &--no-value
      +clr-txt($opacity: 60)

  &__button-icon
    +tran(transform)
    +center-v
    right: 20px

  &__left-icon
    +center-v
    left: 12px

  &--has-left-icon
    .selector
      &__label
        left: 50px

      &__button-text
        +pl( 30px)

  .dropdown
    +zi(selector-dropdown)
    +clr-bg(input-background)
    +brdr(input-border)
    +h(max 300px)
    +pa(10px)
    +w(100%)
    +br-md
    +pos-a(top 44px)

    .options
      +list-reset
      +mt(5px)

      .option
        +br-sm
        +focus-effect(input)

        &:not(:last-child)
          +mb(5px)

        &__input
          +input-radio-reset

        &__label
          +tran(color)
          +block
          +pl(10px)

        &:hover,
        &:focus
          +clr-bg

        &--selected
          +clr-bg(input-select-selected-bg, 30)
          &:hover,
          &:focus
            +clr-bg(input-select-selected-bg, 60)

  &--has-error
    +clr(error, border-color)
    +mb(15px)

    .selector__button-text,
    .selector__label
      +clr-txt(error)

    .dropdown
      +clr(error, border-color)
</style>
