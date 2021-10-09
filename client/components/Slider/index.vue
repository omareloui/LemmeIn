<template>
  <div ref="swiperContainer">
    <swiper
      ref="swiper"
      class="swiper"
      v-bind="{ options }"
      v-if="optionsReady"
      @transition-end="updateFadingData"
      :class="{
        'swiper--not-start': !isSlideStart,
        'swiper--not-end': !isSlideEnd
      }"
    >
      <slot></slot>
    </swiper>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { Swiper, SwiperOptions } from "swiper"
import { ExtendVueRefs } from "~/@types"

import "swiper/swiper-bundle.css"

interface Refs {
  swiperContainer: HTMLDivElement
  swiper: (Vue & { $swiper: Swiper }) | undefined
}

export default (Vue as ExtendVueRefs<Refs>).extend({
  props: {
    slidesPerView: {
      type: [Number, String] as PropType<number | "auto">,
      default: 3
    },
    autoItemsPerView: { type: Boolean, default: false },
    itemWidth: { type: Number },
    gap: { type: Number, default: 30 }
  },

  data: () => ({
    options: {
      slidesPerView: 1,
      spaceBetween: 30,
      freeMode: true
    } as SwiperOptions,

    swiperWidth: 0,
    optionsReady: false,
    isSlideStart: true,
    isSlideEnd: false
  }),

  mounted() {
    this.init()
    window.addEventListener("resize", this.handleItemsToPreview)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleItemsToPreview)
  },

  computed: {
    slidesCount(): number {
      const slidesCount = this.swiperWidth / (this.itemWidth + this.gap)
      return Math.floor(slidesCount)
    }
  },

  methods: {
    init() {
      this.options.spaceBetween = this.gap
      this.handleItemsToPreview()
      this.optionsReady = true
    },

    updateFadingData() {
      this.isSlideStart = !!this.$refs.swiper?.$swiper.isBeginning
      this.isSlideEnd = !!this.$refs.swiper?.$swiper.isEnd
    },

    handleItemsToPreview() {
      this.setSwiperWidth()
      this.setItemsPerView()
    },

    setItemsPerView() {
      this.options.slidesPerView = this.slidesCount
    },

    setSwiperWidth() {
      this.swiperWidth = this.$refs.swiperContainer.clientWidth
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.swiper
  +pos-r
  +py(10px)

  &::after,
  &::before
    --clr: hsl(var(--clr-hs-background-secondary) var(--clr-l-background-secondary) / var(--clr-o-50))
    z-index: 1
    content: ""
    +pos-a(top 0)
    +block
    +size(30px 100%)
    +no-select
    +not-clickable
    +tran(opacity)
    opacity: 0

  &::after
    left: 0
    background-image: linear-gradient(to right, var(--clr), transparent)
  &::before
    right: 0
    background-image: linear-gradient(to left, var(--clr), transparent)

  &.swiper--not-start
    &::after
      opacity: 1

  &.swiper--not-end
    &::before
      opacity: 1
</style>
