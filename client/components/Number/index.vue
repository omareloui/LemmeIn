<template>
  <component :is="tag">{{ updateNumber.current }}{{ suffix }}</component>
</template>

<script lang="ts">
import Vue from "vue"
import initUpdateNumber from "~/assets/utils/updateNumber"

export default Vue.extend({
  props: {
    number: { type: Number, required: true },
    tag: { type: String, default: "span" },
    speed: { type: Number, default: 20 },
    suffix: { type: String }
  },

  data: () => ({
    updateNumber: { current: 0 } as ReturnType<typeof initUpdateNumber>
  }),

  async mounted() {
    this.updateNumber = initUpdateNumber(this.number, this.speed)
    await this.updateNumber.update()
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
