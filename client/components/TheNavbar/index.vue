<template>
  <header>
    <container no-heading>
      <div class="home">
        <nuxt-link to="/">
          <icon name="logo" size="50px" fill="hsl(var(--clr-primary))"></icon>
        </nuxt-link>
      </div>

      <span class="gap"></span>

      <!-- <div class="theme">
        <button-base @click="$accessor.theme.toggleTheme()">
          toggle theme
        </button-base>
      </div>
      -->

      <nav class="auth">
        <nuxt-link to="/signin" v-if="!$accessor.auth.isSigned"
          >Sign in</nuxt-link
        >
        <nuxt-link
          class="cta"
          to="/sign-up"
          v-if="!$accessor.auth.isSigned"
          is-cta
          >Sign up</nuxt-link
        >
      </nav>
    </container>
  </header>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  methods: {
    async signout() {
      await this.$accessor.auth.signOut()
      this.$router.push("/")
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

header
  +py(10px)
  +pos-s(top 0)
  +zi(nav)
  *
    +fnt(nav)

  &::v-deep .container
    display: grid
    grid-template-columns: 1fr auto 2fr
    grid-template-areas: "home - auth"
    gap: 10px
    place-items: center

  // Add grid area
  @each $grid-area in home auth
    .#{$grid-area}
      grid-area: #{$grid-area}

  .home
    justify-self: start
    +size(50px)
    a
      display: inline-block
      +size(100%)

  .auth
    justify-self: right
    display: grid
    grid-template-columns: 1fr 1fr
    gap: 15px
    +no-wrap
    a
      +no-underline
      +clr-txt
      +fnt-xl
      &.cta
        +clr-txt(primary)
</style>
