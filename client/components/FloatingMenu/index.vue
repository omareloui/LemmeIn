<template>
  <div class="floating-menu" :class="{ 'floating-menu--open': isOpen }">
    <button-nav
      class="open-menu"
      icon="add"
      size="50px"
      @click="toggleMenu"
      :color="isOpen ? 'cancel' : 'primary'"
    />

    <transition name="floating-menu">
      <div class="options" v-if="isOpen">
        <button-nav
          v-for="(option, index) in options"
          :key="index"
          class="options__button"
          :icon="option.icon.name"
          :icon-view-box="option.icon.viewBox"
          size="50px"
          @click="option.onClick"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  data: () => ({
    isOpen: false,
    options: [
      {
        icon: { name: "generate", viewBox: "24.8 32" },
        onClick: (): unknown => ({})
      },
      {
        icon: { name: "key" },
        onClick: (): unknown => ({})
      }
    ]
  }),

  mounted() {
    window.addEventListener("click", this.handleClick)
  },
  beforeDestroy() {
    window.removeEventListener("click", this.handleClick)
  },

  methods: {
    closeMenu() {
      this.isOpen = false
    },
    openMenu() {
      this.isOpen = true
    },
    toggleMenu() {
      if (this.isOpen) this.closeMenu()
      else this.openMenu()
    },
    handleClick(e: MouseEvent) {
      const clickedElements = e.composedPath() as HTMLElement[]
      let shouldClose = true
      clickedElements.forEach(x => {
        if (x?.classList?.contains("open-menu")) {
          shouldClose = false
        }
      })
      if (shouldClose) this.closeMenu()
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.floating-menu
  +pos-f(bottom 20px right 30px)

  // Open button
  .open-menu
    +tran(transform, 100ms)

  +m(open)
    .open-menu
      transform: rotate(45deg)

  // Options buttons
  .options
    +pos-a(bottom 120%)
    display: grid
    gap: 10px
</style>
