<template>
  <transition name="dialogue">
    <glass-card
      v-if="isShown"
      border-radius="none"
      no-back-shape
      tint="background-main"
      :blur="10"
      class="dialogue-wrapper"
    >
      <div class="dialogue">
        <div class="dialogue__body">
          <slot></slot>
          <button-glass
            v-if="!noCloseButton"
            class="close"
            icon="close"
            color="cancel"
            @click="closeDialogue"
          />
        </div>
      </div>
    </glass-card>
  </transition>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    isShown: { type: Boolean, required: true, default: false },
    noCloseButton: { type: Boolean, default: false }
  },

  mounted() {
    window.addEventListener("keyup", this.onKeyUp)
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.onKeyUp)
  },

  methods: {
    onKeyUp(e: KeyboardEvent) {
      if (e.code === "Escape") this.closeDialogue()
    },

    closeDialogue() {
      this.$emit("close")
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.dialogue-wrapper
  +zi(dialogue)
  +pos-f(top 0 left 0)

  .dialogue
    +w(100vw)
    +h(100vh)

    +e(body)
      +pos-r
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
