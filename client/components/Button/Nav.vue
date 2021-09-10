<template>
  <div class="button-nav">
    <glass-circle
      v-bind="{ size }"
      float
      back-shape-size="40%"
      tint="background-main"
      back-shape-color="info"
      :blur="2"
      :opacity="40"
    >
      <button-base
        size="100%"
        class="button-nav__button"
        @click="onClick('single')"
        @dblclick="onClick('dbl')"
      >
        <icon :name="icon" :view-box="iconViewBox" :size="iconSize"></icon>
      </button-base>
    </glass-circle>

    <glass-card
      v-if="!!description"
      no-back-shape
      tint="background-secondary"
      float
      class="button-nav__description"
      :opacity="40"
    >
      <span>{{ description }}</span>
    </glass-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    type: { type: String, default: "button" },
    size: { type: String, default: "40px" },
    isLoading: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },

    description: { type: String },
    icon: { type: String, required: true },
    iconViewBox: { type: String, default: "32 32" },
    iconSize: { type: String, default: "20px" }
  },

  methods: {
    onClick(event: "single" | "dbl") {
      if (!this.isDisabled)
        this.$emit(event === "single" ? "click" : "dblclick")
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.button-nav
  +pos-r
  +e(button)
    +pos-unset
    +br-cr
    ::v-deep
      .button__content
        +pos-r
      i
        +center

  +e(description)
    z-index: -1
    position: absolute !important
    +pos-a(top 50% right 120%)
    +no-select
    opacity: 0
    transform: translate(50px , -50%)
    +tran
    +w(max-content)
    span
      +inline-block
      +pa(5px)
      +fnt-xs
      +capitalize
  &:hover
    .button-nav__description
      opacity: 1
      transform: translate(0, -50%)
</style>
