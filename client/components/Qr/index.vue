<template>
  <img
    :src="qrCode"
    :alt="contentName ? 'qr code' : `qr code for ${contentName}`"
  />
</template>

<script lang="ts">
import Vue from "vue"
import { toDataURL } from "qrcode"

export default Vue.extend({
  props: {
    text: { type: String, required: true },
    contentName: { type: String }
  },

  data: () => ({
    qrCode: ""
  }),

  created() {
    this.createQR()
  },

  methods: {
    async createQR() {
      try {
        if (!this.qrCode) {
          this.qrCode = await toDataURL(this.text, {
            errorCorrectionLevel: "H",
            margin: 2,
            color: {
              dark: "#191b1f",
              light:
                this.$accessor.theme.currentTheme === "dark"
                  ? "#ffffff"
                  : "#ffffff00"
            }
          })
        }
      } catch (e) {
        this.$notify.error(e.message)
      }
    },

    recreateQR() {
      this.qrCode = ""
      this.createQR()
    }
  },

  watch: {
    "$store.state.theme.currentTheme": function removeCache() {
      this.recreateQR()
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
