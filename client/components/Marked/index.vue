<template>
  <div v-html="parsed"></div>
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
