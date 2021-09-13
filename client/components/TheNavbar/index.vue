<template>
  <header>
    <container no-heading>
      <div class="home header--left">
        <glass-card class="glass-nav" no-back-shape tint="background-main">
          <nuxt-link to="/">
            <icon
              name="logo"
              size="100%"
              fill="var(--clr-primary)"
              view-box="32 30"
            ></icon>
          </nuxt-link>
        </glass-card>
      </div>

      <span class="gap"></span>

      <transition name="fade">
        <div class="menu header--right" v-if="isSigned">
          <button-glass
            class="menu__button"
            icon="nav-menu"
            icon-view-box="32 7.5"
            @click="toggleMenu"
          />

          <transition name="nav-menu">
            <nav class="menu__options" v-if="isOptionsShown">
              <button-glass
                v-for="(option, index) in menuOptions.filter(x => !x.doNotShow)"
                :key="index"
                v-bind="option.button"
                @click="option.onClick"
              />
            </nav>
          </transition>
        </div>
      </transition>

      <transition name="fade">
        <nav class="auth header--right" v-if="!isSigned">
          <glass-card class="glass-nav" no-back-shape tint="background-main">
            <nuxt-link to="/signin">Sign in</nuxt-link>
            <nuxt-link class="cta" to="/sign-up" is-cta>Sign up</nuxt-link>
          </glass-card>
        </nav>
      </transition>
    </container>
  </header>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  mounted() {
    window.addEventListener("click", this.handleClick)
  },
  beforeDestroy() {
    window.removeEventListener("click", this.handleClick)
  },

  data() {
    return {
      isOptionsShown: false,
      menuOptions: [
        {
          button: {
            icon: "vault",
            description: "vault",
            iconViewBox: "32 25.6"
          },
          onClick: () => this.$router.push("/vault")
        },
        {
          button: {
            icon: "tags",
            description: "tags",
            iconViewBox: "28.3 32"
          },
          onClick: () => this.$router.push("/tags")
        },
        {
          button: {
            icon: "password-health",
            description: "passwords health",
            iconViewBox: "31.1 32"
          },
          onClick: () => this.$router.push("/passwords-health")
        },
        {
          button: {
            icon: "dashboard",
            description: "dashboard",
            iconViewBox: "32 26.7"
          },
          onClick: () => this.$router.push("/dashboard"),
          doNotShow:
            !this.$accessor.auth.isSigned ||
            this.$accessor.auth.user?.role !== "admin"
        },
        {
          button: {
            icon: "settings",
            description: "settings",
            iconViewBox: "28.8 32"
          },
          onClick: () => this.$router.push("/settings")
        },
        {
          button: {
            icon:
              this.$accessor.theme.currentTheme === "light"
                ? "dark-theme"
                : "light-theme",
            description: `${
              this.$accessor.theme.currentTheme === "dark" ? "light" : "dark"
            } theme`
          },
          onClick: this.$accessor.theme.toggleTheme
        },
        {
          button: {
            icon: "logout",
            description: "logout",
            iconViewBox: "25.6 32"
          },
          onClick: async () => {
            await this.$accessor.auth.signOut()
            this.$router.push("/")
          }
        }
      ]
    }
  },

  methods: {
    handleClick(e: MouseEvent) {
      const clickedElements = e.composedPath() as HTMLElement[]
      let shouldClose = true
      clickedElements.forEach(x => {
        if (x?.classList?.contains("menu__button")) {
          shouldClose = false
        }
      })
      if (shouldClose) this.closeMenu()
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
  },

  computed: {
    currentTheme(): string {
      return this.$accessor.theme.currentTheme
    },
    isSigned(): boolean {
      return this.$accessor.auth.isSigned
    }
  },

  watch: {
    currentTheme(newValue) {
      this.menuOptions = this.menuOptions.map(x => {
        if (x.button.icon.indexOf("theme") > -1) {
          if (newValue === "light") {
            x.button.icon = "dark-theme"
            x.button.description = "dark theme"
          } else {
            x.button.icon = "light-theme"
            x.button.description = "light theme"
          }
        }
        return x
      })
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
  +not-clickable
  height: var(--header-height)

  .glass-nav
    +size(100%)
    &::v-deep .glass__body
      +size(100%)
      +pa(5px)

  &::v-deep .container
    display: grid
    grid-template-columns: 1fr auto 2fr
    grid-template-areas: "header-left - header-right"
    gap: 10px
    place-items: center
    height: 100%

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
    +size(76px 70px)
    a
      display: inline-block
      +size(100%)
      +clickable

  .menu
    +e(options)
      +pos-a
      top: calc(var(--header-height) + 10px)
      display: grid
      gap: 10px

  .auth
    .glass-nav
      +w(min-content)
      display: grid
      grid-template-columns: 1fr 1fr
      gap: 15px
      +no-wrap
    a
      +no-underline
      +clr-txt
      +fnt(nav)
      +fnt-xl
      +clickable
      &.cta
        +clr-txt(primary)
</style>
