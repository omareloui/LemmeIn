<template>
  <glass-card
    class="password-reveal"
    :class="{ 'password-reveal--shown': isPassShown }"
    v-bind="glassCardProps"
  >
    <div class="password-reveal__body">
      <span class="password">
        {{ isPassShown ? password : "********" }}
      </span>

      <glass-card
        v-bind="glassCardProps"
        :blur="30"
        :opacity="0.8"
        class="overlay__wrapper"
      >
        <div class="overlay"></div>
      </glass-card>

      <icon
        class="icon"
        :name="isPassShown ? 'eye-closed' : 'eye'"
        size="28px"
        clickable
        focusable
        @click="toggleShowPass"
      />
    </div>
  </glass-card>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    password: { type: String, required: true }
  },

  data: () => ({
    isPassShown: false,
    glassCardProps: {
      noBackShape: true,
      tint: "background-secondary"
    }
  }),

  methods: {
    toggleShowPass() {
      this.isPassShown = !this.isPassShown
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.password-reveal
  --height: 45px

  +e(body)
    +pos-r
    +size(100% var(--height))
    +w(max calc(min(100vw, var(--container-width)) - 90px))
    +no-wrap
    +br-md
    +px(10px)
    overflow: hidden
    line-height: var(--height)

    .overlay
      +pos-a(top 0 left 0)
      +size(100%)
      +tran(opacity)

    .icon
      +center-v
      right: 10px

    .password
      +clr-txt(main, $opacity: 0.2)

  +m(shown)
    +e(password-reveal, body)
      .overlay
        opacity: 0
      .password
        +clr-txt(main)
</style>
