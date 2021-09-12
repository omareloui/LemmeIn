<template>
  <div class="floating-menu" :class="{ 'floating-menu--open': isMenuOpen }">
    <button-glass
      class="open-menu"
      icon="add"
      size="50px"
      @click="toggleMenu"
      :color="isMenuOpen ? 'cancel' : 'primary'"
    />

    <transition name="floating-menu">
      <div class="options" v-if="isMenuOpen">
        <button-glass
          class="options__button"
          icon="generate"
          icon-view-box="24.8 32"
          size="50px"
          @click="isPassGenShown = true"
        />

        <button-glass class="options__button" icon="key" size="50px" />
      </div>
    </transition>

    <dialogue :is-shown="isPassGenShown" @close="isPassGenShown = false">
      <password-generator />
    </dialogue>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  data: () => ({
    isMenuOpen: false,
    isPassGenShown: false
  }),

  mounted() {
    window.addEventListener("click", this.handleClick)
  },
  beforeDestroy() {
    window.removeEventListener("click", this.handleClick)
  },

  methods: {
    closeMenu() {
      this.isMenuOpen = false
    },
    openMenu() {
      this.isMenuOpen = true
    },
    toggleMenu() {
      if (this.isMenuOpen) this.closeMenu()
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
  +zi(floating-menu)
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
