<template>
  <glass-card
    circle
    back-shape="circle"
    v-bind="{
      blur,
      opacity,
      tint,
      float,
      textColor,
      noBackShape,
      backShapeSize,
      backShapeColor
    }"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <slot></slot>
  </glass-card>
</template>


<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    size: { type: String, default: "25px" },
    float: { type: Boolean, default: false },

    blur: { type: Number, default: 4 },
    opacity: { type: Number, validator: v => v > 0 && v < 1, default: 0.2 },

    tint: { type: String },
    textColor: { type: String, default: "text-main" },

    noBackShape: { type: Boolean, default: false },

    backShapeSize: { type: String, default: "60%" },
    backShapeColor: { type: String }
  }
})
</script>
