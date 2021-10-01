<template>
  <div class="floating-menu" :class="{ 'floating-menu--open': isMenuOpen }">
    <button-glass
      class="open-menu"
      icon="add"
      size="50px"
      @click="toggleMenu"
      :color="isMenuOpen ? 'cancel' : 'primary'"
      aria-label="floating menu"
    />

    <transition name="floating-menu">
      <div class="options" v-if="isMenuOpen">
        <button-glass
          class="options__button"
          icon="generate"
          icon-view-box="24.8 32"
          size="50px"
          @click="openPassGen"
          aria-label="generate password"
        />

        <button-glass
          class="options__button"
          icon="key"
          size="50px"
          @click="openAddPass"
          aria-label="add new password"
        />
      </div>
    </transition>

    <dialogue :is-shown="isAddPassShown" @close="closeAddPass">
      <account-add
        @close-dialogue="closeAddPass"
        :password="defaultPasswordForAddPass"
      />
    </dialogue>
    <dialogue :is-shown="isPassGenShown" @close="closePassGen">
      <password-generator @save-password="savePassword" />
    </dialogue>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  data: () => ({
    isMenuOpen: false,
    isPassGenShown: false,
    isAddPassShown: false,

    defaultPasswordForAddPass: ""
  }),

  mounted() {
    window.addEventListener("click", this.handleClick)
  },
  beforeDestroy() {
    window.removeEventListener("click", this.handleClick)
  },

  methods: {
    savePassword(password: string) {
      this.closeAllDialogues()
      this.openAddPass()
      this.defaultPasswordForAddPass = password
    },

    clearDefaultPass() {
      this.defaultPasswordForAddPass = ""
    },

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
    },

    closeAllDialogues() {
      this.closePassGen()
      this.closeAddPass()
    },

    openAddPass() {
      this.closeAllDialogues()
      this.isAddPassShown = true
    },
    closeAddPass() {
      this.isAddPassShown = false
      this.clearDefaultPass()
    },

    openPassGen() {
      this.closeAllDialogues()
      this.isPassGenShown = true
    },
    closePassGen() {
      this.isPassGenShown = false
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
    +grid($gap: 10px)
</style>
