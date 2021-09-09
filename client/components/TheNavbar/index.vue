<template>
  <header>
    <container no-heading>
      <div class="home header--left">
        <nuxt-link to="/">
          <icon
            name="logo"
            size="50px"
            fill="hsl(var(--clr-primary))"
            view-box="32 30"
          ></icon>
        </nuxt-link>
      </div>

      <span class="gap"></span>

      <!-- <div class="theme">
        <button-base @click="$accessor.theme.toggleTheme()">
          toggle theme
        </button-base>
      </div> -->

      <div class="menu header--right" v-if="$accessor.auth.isSigned">
        <button-nav
          class="menu__button"
          icon="nav-menu"
          icon-view-box="32 7.5"
          @click="toggleMenu"
        />

        <transition name="nav-menu">
          <nav class="menu__options" v-if="isOptionsShown">
            <button-nav
              :icon="
                $accessor.theme.currentTheme === 'light'
                  ? 'dark-theme'
                  : 'light-theme'
              "
              :icon-view-box="
                $accessor.theme.currentTheme === 'light' ? '30.9 32' : '32 32'
              "
              @click="$accessor.theme.toggleTheme"
              :description="`${
                $accessor.theme.currentTheme === 'dark' ? 'light' : 'dark'
              } theme`"
            />
            <button-nav icon="logout" @click="signout" description="logout" />
          </nav>
        </transition>
      </div>

      <nav class="auth header--right" v-else>
        <nuxt-link to="/signin">Sign in</nuxt-link>
        <nuxt-link class="cta" to="/sign-up" is-cta>Sign up</nuxt-link>
      </nav>
    </container>
  </header>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  data: () => ({
    isOptionsShown: false
  }),

  methods: {
    async signout() {
      await this.$accessor.auth.signOut()
      this.$router.push("/")
    },
    closeMenu() {
      this.isOptionsShown = false
    },
    openMenu() {
      this.isOptionsShown = true
    },
    toggleMenu() {
      if (this.isOptionsShown) this.closeMenu()
      else this.openMenu()
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

header
  +py(10px)
  +zi(nav)
  +pos-s(top 0)
  height: var(--header-height)

  &::v-deep .container
    display: grid
    grid-template-columns: 1fr auto 2fr
    grid-template-areas: "header-left - header-right"
    gap: 10px
    place-items: center

  // Add grid areas
  @each $grid-area in left right
    .header--#{$grid-area}
      grid-area: header-#{$grid-area}

  .header
    +m(left)
      justify-self: start
    +m(right)
      justify-self: right

  .home
    +size(50px 46px)
    a
      display: inline-block
      +size(100%)

  .menu
    +e(options)
      +pos-a
      top: calc(var(--header-height) + 10px)
      display: grid
      gap: 10px

  .auth
    display: grid
    grid-template-columns: 1fr 1fr
    gap: 15px
    +no-wrap
    a
      +no-underline
      +clr-txt
      +fnt(nav)
      +fnt-xl
      &.cta
        +clr-txt(primary)
</style>
