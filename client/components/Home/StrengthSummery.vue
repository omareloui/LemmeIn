<template>
  <glass-card
    class="strength"
    back-shape="pill"
    back-shape-position="bottom"
    :back-shape-color="color"
    back-shape-height="30%"
    back-shape-width="85%"
    tint="background-secondary"
    :blur="23"
  >
    <div>
      <number v-bind="{ number }" class="strength__number" />
      <h3 class="strength__title">{{ title }}</h3>
    </div>
  </glass-card>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    title: { type: String, required: true },
    number: { type: Number, required: true },
    color: { type: String, required: true }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.strength
  +pos-r
  +w(100%)
  > div
    +py(20px)
    +center-text
    +br-lg

  +e(number)
    +fnt-7xl
    +fnt(heading)

  +e(title)
    +fnt-normal
    +fnt-lg
    text-transform: capitalize
</style>
