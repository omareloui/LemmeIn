<template>
  <div>
    <div class="notifications">
      <div
        :class="`notification notification--${notification.type} ${
          notification.isShown ? 'notification--shown' : ''
        }`"
        v-for="notification in $store.state.notify.notifications"
        :key="notification.id"
      >
        <transition name="fade">
          <div class="notification__content" v-if="notification.isShown">
            {{ notification.message }}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

$offset: 10px

.notifications
  display: grid
  gap: 5px
  grid-template-columns: 1fr
  +pos-f(bottom $offset right $offset)
  +w(100%)
  +clr-txt(light)
  +not-clickable

  .notification
    display: grid
    justify-items: right
    justify-self: right
    width: calc(100% - #{$offset} * 2)
    text-align: center
    +fnt-lg

    +lt-tablet
      +w(auto)
      max-width: calc(var(--screen-tablet) - #{$offset * 2})
      text-align: left

    &__content
      +br-sm
      +pa(10px 20px)

    // Set notifications colors
    @each $type in success error warn info
      &--#{$type} .notification__content
        +clr-bg($type)
</style>
