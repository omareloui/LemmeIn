<template>
  <div :class="{ 'slider--loaded': isLoaded }" ref="slider" class="slider">
    <div ref="wrapper" class="wrapper">
      <div ref="items" class="items">
        <span ref="slide" v-for="index in 5" :key="index" class="slide"
          >Slide{{ index }}</span
        >
      </div>
    </div>
    <a ref="prev" class="control control--prev"></a>
    <a ref="next" class="control control--next"></a>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { ExtendVueRefs } from "~/@types"

interface Refs {
  slider: HTMLElement
  wrapper: HTMLElement
  items: HTMLElement
  slide: HTMLElement[]
  prev: HTMLAnchorElement
  next: HTMLAnchorElement
}

export default (Vue as ExtendVueRefs<Refs>).extend({
  mounted() {
    this.items.addEventListener("mousedown", this.dragStart)

    this.items.addEventListener("touchstart", this.dragStart)
    this.items.addEventListener("touchend", this.dragEnd)
    this.items.addEventListener("touchmove", this.dragAction)

    this.$refs.prev.addEventListener("click", this.onPrevClick)
    this.$refs.next.addEventListener("click", this.onNextClick)

    this.items.addEventListener("transitionend", this.checkIndex)

    this.slide()
  },

  beforeDestroy() {
    this.items.removeEventListener("mousedown", this.dragStart)

    this.items.removeEventListener("touchstart", this.dragStart)
    this.items.removeEventListener("touchend", this.dragEnd)
    this.items.removeEventListener("touchmove", this.dragAction)

    this.$refs.prev.removeEventListener("click", this.onPrevClick)
    this.$refs.next.removeEventListener("click", this.onNextClick)

    this.items.removeEventListener("transitionend", this.checkIndex)
  },

  data() {
    return {
      index: 0,
      posX1: 0,
      posX2: 0,
      posInitial: 0,
      posFinal: 0,
      threshold: 100,
      allowShift: true,
      isLoaded: false
    }
  },

  computed: {
    slides(): HTMLElement[] {
      return this.$refs.slide
    },
    items(): HTMLElement {
      return this.$refs.items
    },
    wrapper(): HTMLElement {
      return this.$refs.wrapper
    },
    slidesLength(): number {
      return this.slides.length
    },
    slideSize(): number {
      return this.slides[0].offsetWidth
    },
    firstSlide(): HTMLElement {
      return this.slides[0]
    },
    lastSlide(): HTMLElement {
      // @ts-ignore
      return this.slides.at(-1)
    }
  },

  methods: {
    slide() {
      // Clone first and last slide
      this.items.appendChild(this.cloneFirst())
      this.items.insertBefore(this.cloneLast(), this.firstSlide)
      this.isLoaded = true
    },

    cloneFirst(): Node {
      return this.firstSlide.cloneNode(true)
    },
    cloneLast(): Node {
      return this.lastSlide.cloneNode(true)
    },

    dragStart(e: MouseEvent | TouchEvent) {
      e = e || window.event
      e.preventDefault()
      this.posInitial = this.items.offsetLeft

      if (e.type === "touchstart") {
        this.posX1 = (e as TouchEvent).touches[0].clientX
      } else {
        this.posX1 = (e as MouseEvent).clientX
        document.onmouseup = this.dragEnd
        document.onmousemove = this.dragAction
      }
    },

    dragAction(e: MouseEvent | TouchEvent) {
      e = e || window.event
      if (e.type === "touchmove") {
        this.posX2 = this.posX1 - (e as TouchEvent).touches[0].clientX
        this.posX1 = (e as TouchEvent).touches[0].clientX
      } else {
        this.posX2 = this.posX1 - (e as MouseEvent).clientX
        this.posX1 = (e as MouseEvent).clientX
      }
      this.items.style.left = `${this.items.offsetLeft - this.posX2}px`
    },

    dragEnd() {
      this.posFinal = this.items.offsetLeft
      if (this.posFinal - this.posInitial < -this.threshold) {
        this.shiftSlide(1, "drag")
      } else if (this.posFinal - this.posInitial > this.threshold) {
        this.shiftSlide(-1, "drag")
      } else {
        this.items.style.left = `${this.posInitial}px`
      }

      document.onmouseup = null
      document.onmousemove = null
    },

    onPrevClick() {
      this.shiftSlide(-1)
    },
    onNextClick() {
      this.shiftSlide(1)
    },

    shiftSlide(dir: number, action?: string) {
      this.items.classList.add("shifting")

      if (this.allowShift) {
        if (!action) {
          this.posInitial = this.items.offsetLeft
        }

        if (dir === 1) {
          this.items.style.left = `${this.posInitial - this.slideSize}px`
          this.index++
        } else if (dir === -1) {
          this.items.style.left = `${this.posInitial + this.slideSize}px`
          this.index--
        }
      }

      this.allowShift = false
    },

    checkIndex() {
      this.items.classList.remove("shifting")
      if (this.index === -1) {
        this.items.style.left = `${-(this.slidesLength * this.slideSize)}px`
        this.index = this.slidesLength - 1
      }

      if (this.index === this.slidesLength) {
        this.items.style.left = `${-(1 * this.slideSize)}px`
        this.index = 0
      }

      this.allowShift = true
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.slider
  +pos-r
  width: 300px
  height: 200px
  opacity: 0

  +m(loaded)
    opacity: 1

  .wrapper
    overflow: hidden
    position: relative
    background: #222
    z-index: 1

  .items
    width: 10000px
    position: relative
    top: 0
    left: -300px
    &.shifting
      transition: left .2s ease-out

    .slide
      width: 300px
      height: 200px
      cursor: pointer
      float: left
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center
      transition: all 1s
      position: relative

      &:nth-child(2),
      &:nth-child(7)
        background: #FFCF47
      &:nth-child(1),
      &:nth-child(6)
        background: #7ADCEF

      &:nth-child(3)
        background: #F97C68
      &:nth-child(4)
        background: #a78df5
      &:nth-child(5)
        background: #ff8686

.control
  position: absolute
  top: 50%
  width: 40px
  height: 40px
  background: #fff
  border-radius: 20px
  margin-top: -20px
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3)
  z-index: 2
  background-size: 22px
  background-position: center
  background-repeat: no-repeat
  cursor: pointer

  +m(prev)
    background-image: url("/icons/chevron-left.svg")
    left: -20px

  +m(next)
    background-image: url("/icons/chevron-right.svg")
    right: -20px

  &:active
    transform: scale(0.8)
</style>
