<template>
  <div class="button-glass" :style="{ '--size': size }">
    <glass-circle
      float
      class="button-glass__glass-layer"
      back-shape-size="58%"
      tint="background-main"
      :back-shape-color="color"
      :blur="2"
      :opacity="0.4"
    >
      <button-base
        class="button-glass__button"
        @click="onClick('single')"
        @dblclick="onClick('dbl')"
        v-bind="{ ariaLabel: description || ariaLabel }"
      >
        <icon :name="icon" :view-box="iconViewBox" :size="iconSize"></icon>
      </button-base>
    </glass-circle>

    <glass-card
      v-if="!!description"
      no-back-shape
      tint="background-secondary"
      float
      class="button-glass__description"
      :opacity="0.4"
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
    ariaLabel: { type: String },
    size: { type: String, default: "40px" },
    isLoading: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },

    description: { type: String },
    icon: { type: String, required: true },
    iconViewBox: { type: String, default: "32 32" },
    iconSize: { type: String, default: "18px" },

    color: { type: String, default: "info" }
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

.button-glass
  +pos-r

  +e(glass-layer)
    +size(var(--size))
    +br-cr

  +e(button)
    +block
    +br-cr
    +size(100%)
    i
      +center

  +e(description)
    z-index: -1
    +pos-a(top 50% right 120%)
    +no-select
    +tran
    opacity: 0
    transform: translate(50px , -50%)
    span
      +inline-block
      +no-wrap
      +pa(5px)
      +fnt-xs
      +capitalize

  &:hover
    +e(button-glass, description)
      opacity: 1
      transform: translate(0, -50%)
</style>
