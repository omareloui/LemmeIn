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
  *
    +fnt(marked)

  * + *
    +mb(5px)

  code,
  pre
    +fnt(marked-code)
    +clr-bg
    +br-md

  code
    +px(5px)
    +mx(-3px)

  pre
    +pa(10px)

  hr
    +clr-bg(text-main)
</style>
