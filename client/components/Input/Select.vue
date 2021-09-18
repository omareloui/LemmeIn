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
    @keyup.space="toggleShowOptions"
    @keyup.up="focusPrevOption"
    @keyup.down="focusNextOption"
    @keydown.space.prevent
    @keydown.up.prevent
    @keydown.down.prevent
  >
    <div class="selector__label" @click="openDropdown">{{ label }}</div>

    <glass-card
      class="selector__button"
      @click="toggleShowOptions"
      tint="background-tertiary"
      no-back-shape
      :opacity="0.4"
      :blur="5"
    >
      <div tabindex="0">
        <icon
          :name="leftIcon"
          v-if="!!leftIcon"
          size="28px"
          class="selector__left-icon"
          :fill="!!errorMessage ? 'error' : 'dark'"
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
            fill: isErred ? 'error' : 'dark'
          }"
        />
      </div>
    </glass-card>

    <transition name="fade">
      <span v-if="isErred" class="selector__error">{{ errorMessage }}</span>
    </transition>

    <transition name="slide-down">
      <glass-card
        v-if="isDropdownOpen"
        tint="background-tertiary"
        no-back-shape
        :opacity="0.4"
        :blur="5"
        border-radius="md"
        :id="identifier"
        class="dropdown"
        :class="{ 'dropdown--open': isDropdownOpen }"
      >
        <div>
          <input-search
            v-if="isSearchable"
            ref="searchField"
            class="dropdown__search"
            v-model="searchQuery"
            @clear="clearSearch"
            @search-result="searchResult = $event"
            :search-keys="primaryKey"
            :search-elements="options"
            no-autocomplete
          />

          <transition-group name="input-select-search" tag="ul" class="options">
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
          </transition-group>
        </div>
      </glass-card>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { ExtendVueRefs, HTMLInputEvent, InputSelectOption } from "~/@types"

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
      type: Array as PropType<InputSelectOption[]>,
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

    selectedOption(): InputSelectOption | undefined {
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

  +e(label)
    +zi(selector-label)
    +tran
    +center-v
    +pos-a(left 10px)
    +clr-txt
    +fnt-medium
    +no-select
    +clickable
    opacity: 0.6

  +e(button)
    +zi(selector)
    > div
      +focus-effect(input)
      +pos-r
      +size(100% 45px)
      +br-md
      +brdr(none)
      +clickable

  +m(has-label)
    +mt(15px)

  +m(hover-label)
    .selector__label
      top: -10px
      left: 5px !important
      opacity: 1
      +fnt-xs

  +e(error)
    +pos-a(left 10px top 50px)
    +clr-txt(error)
    +fnt-xs

  +e(button-text)
    +center-v
    left: 10px
    +m(no-value)
      +clr-txt($opacity: 60)

  +e(button-icon)
    +tran(transform)
    +center-v
    right: 20px

  +e(left-icon)
    +center-v
    left: 12px

  +m(has-left-icon)
    .selector
      +e(label)
        left: 50px

      +e(button-text)
        +pl( 30px)

  +m(has-error)
    +mb(15px)
    +e(selector, button)
      > div
        +clr(error, border-color)

    +e(selector, button-icon)
      ::v-deep svg
        +clr(error, fill)

    .selector__button-text,
    .selector__label
      +clr-txt(error)

  .dropdown
    +pos-r
    +zi(selector-dropdown)
    > div
      +pos-a(top 5px)
      +pa(10px)
      +w(100%)
      +h(max 200px)
      +scroll
      +br-md
      +brdr(none)
      overflow-x: auto

    .options
      +list-reset
      +mt(5px)

      .option
        +br-sm
        +focus-effect(input)
        +pa(5px 10px)

        &:hover,
        &:focus
          +clr-bg(secondary)

        +m(selected)
          +clr-bg

        &:not(:last-child)
          +mb(5px)

        +e(input)
          +input-radio-reset

        +e(label)
          +tran(color)
          +block
          +clickable

  +m(has-error)
    .dropdown
      > div
        +clr(error, border-color)
</style>
