<template>
  <header>
    <container no-heading>
      <div class="home">
        <nuxt-link to="/">lemme in</nuxt-link>
      </div>

      <!-- <div class="theme">
        <button-base @click="$accessor.theme.toggleTheme()"
          >toggle theme</button-base
        >
      </div>
      <nav class="auth">
        <link-button to="/sign-in">Sign in</link-button>
        <link-button to="/sign-up" is-cta>Sign up</link-button>
      </nav> -->
    </container>
  </header>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  methods: {
    goToSignIn() {
      this.$store.commit("sign/setSignIn")
      this.$router.push("/sign")
    },
    goToSignUp() {
      this.$store.commit("sign/setSignUp")
      this.$router.push("/sign")
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
  +clr-bg(nav)
  +bxs(dark, 0px, -7px, 11px)

  // &::v-deep .container
  //   display: grid
  //   // grid-template-columns: 1fr 4fr 1fr 2fr
  //   // grid-template-areas: "home - theme auth"
  //   gap: 10px

  //   // Add grid area
  //   @each $grid-area in home theme auth
  //     .#{$grid-area}
  //       grid-area: #{$grid-area}

  // .auth
  //   justify-self: right
  //   display: grid
  //   grid-template-columns: 1fr 1fr
  //   gap: 5px

  .home
    +fnt-xl
    +center-text
    a
      +clr-txt(primary)
      text-decoration: none
</style>
