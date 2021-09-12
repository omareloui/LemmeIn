<template>
  <transition name="dialogue">
    <glass-card
      v-if="isShown"
      class="dialogue"
      border-radius="none"
      height="100vh"
      width="100vw"
      no-back-shape
      tint="background-main"
      :blur="10"
    >
      <div class="dialogue__body">
        <slot></slot>
        <button-glass
          class="close"
          icon="close"
          color="cancel"
          @click="$emit('close')"
        />
      </div>
    </glass-card>
  </transition>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    isShown: { type: Boolean, required: true, default: false }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.dialogue
  +zi(dialogue)
  &::v-deep.glass
    +pos-f(top 0 left 0)

  +e(body)
    +scroll
    +center
    +w(min(90%, 600px))
    +h(max 90vh)
    +float(2)
    +br-lg
    +clr-bg(main)
    overflow-y: auto

    .close
      +pos-a(top 20px right 20px)
</style>
