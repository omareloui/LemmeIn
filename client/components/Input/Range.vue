<template>
  <input type="range" v-bind="{ min, max }" :value="value" @input="onInput" />
</template>

<script lang="ts">
import Vue from "vue"
import { HTMLInputEvent } from "~/@types/index"

export default Vue.extend({
  props: {
    value: { type: Number, required: true },
    min: { type: Number, default: 4 },
    max: { type: Number, default: 30 }
  },

  methods: {
    onInput(e: HTMLInputEvent) {
      this.$emit("input", parseInt(e.target.value, 10))
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
