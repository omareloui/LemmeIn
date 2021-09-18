<template>
  <container>
    <template #heading>{{ password.app }}</template>

    <main>
      <div>
        <button-base @click="showQR" class="show-qr">
          <icon name="q-r" />
        </button-base>
      </div>

      <pre>{{ password }}</pre>
    </main>

    <dialogue :is-shown="isQRShown" @close="closeQR">
      <div class="dialogue-content">
        <img :src="qrCode" alt="qr code for the password" />
      </div>
    </dialogue>
  </container>
</template>

<script lang="ts">
import Vue from "vue"
import QRCode from "qrcode"
import { ExtendVue, Password } from "~/@types"

export default (Vue as ExtendVue<{ password: Password }>).extend({
  async asyncData({ $axios, params: { passwordId }, error }) {
    try {
      const { data: password } = await $axios.get(`/passwords/${passwordId}`)
      return { password }
    } catch (e) {
      return error(e.response.data)
    }
  },

  data: () => ({
    isQRShown: false,
    qrCode: ""
  }),

  methods: {
    async showQR() {
      try {
        if (!this.qrCode) {
          const password = await this.$accessor.vault.decryptPassword(
            this.password.id
          )
          this.qrCode = await QRCode.toDataURL(password)
        }
        this.isQRShown = true
      } catch (e) {
        this.$notify.error(e.message)
      }
    },

    closeQR() {
      this.isQRShown = false
    },

    async deletePassword() {
      try {
        await this.$axios.delete(`/passwords/${this.$route.params.passwordId}`)
        this.$router.push("/passwords")
        this.$notify.success("Deleted password successfully")
      } catch (e) {
        throw new Error(e.response.data)
      }
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.dialogue-content
  +pos-r
  +grid($center: true)
  +pa(30px)
  img
    +size(50vmin)
    +br-xl

.show-qr
  > i
    +block
</style>
