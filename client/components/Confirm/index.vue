<template>
  <dialogue
    no-close-button
    :is-shown="$accessor.confirm.isConfirming"
    @close="select('cancel')"
    class="confirmation-dialogue"
  >
    <div class="confirmation">
      <div class="confirmation__body">
        {{ $accessor.confirm.message }}
      </div>
      <div
        v-if="$accessor.confirm.description"
        class="confirmation__description"
      >
        {{ $accessor.confirm.description }}
      </div>
      <div class="confirmation__buttons">
        <button-main large color="info" @click="select('accept')">
          {{ $accessor.confirm.acceptMessage }}
        </button-main>
        <button-main large color="cancel" @click="select('cancel')">
          Cancel
        </button-main>
      </div>
    </div>
  </dialogue>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  methods: {
    select(selected: "accept" | "cancel") {
      let isConfirmed = false
      if (selected === "accept") isConfirmed = true
      this.$accessor.confirm.select(isConfirmed)
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.confirmation-dialogue
  ::v-deep .dialogue__body
    +pa(55px)
    +center-text

  .confirmation
    +e(body)
      +fnt-2xl

    +e(description)
      +mt(10px)
      +fnt-sm
      +clr-txt(main, $opacity: 0.8)

    +e(buttons)
      +mt(20px)
      +grid(1fr, $gap: 20px, $center: true)
      +lt-mobile
        grid-template-columns: 1fr 1fr
</style>
