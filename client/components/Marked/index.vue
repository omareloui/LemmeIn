<template>
  <div v-html="parsed" class="parsed-md"></div>
</template>

<script lang="ts">
import Vue from "vue"
import marked from "marked"
import DOMPurify from "isomorphic-dompurify"

export default Vue.extend({
  props: {
    content: { type: String, required: true }
  },

  created() {
    this.loadContent()
  },

  data: () => ({
    parsed: ""
  }),

  methods: {
    loadContent() {
      const html = marked(this.content)
      const purified = DOMPurify.sanitize(html)
      this.parsed = purified
    }
  }
})
</script>

<style lang="sass">
@use "~/assets/scss/mixins" as *

.parsed-md
  overflow: auto
  +no-scroll

  *
    +fnt(body)

  p, code, pre
    +fnt-lg

  h1, h2, h3, h4, h5, h6
    +fnt(heading)

  * + *
    +mt(5px)

  code,
  pre
    +fnt(marked-code)
    +br-md

  pre
    +clr-bg(tertiary)
    +no-scroll
    overflow: auto

  :not(pre) code
    +clr-bg(tertiary)
    +px(5px)
    +mx(-3px)

  pre
    +pa(10px)

  hr
    +h(3px)
    +clr-bg(text-main)
    +my(10px)

  ul, ol
    +ml(20px)

  img
    +block
    +br-md
    +w(max 100%)
</style>
