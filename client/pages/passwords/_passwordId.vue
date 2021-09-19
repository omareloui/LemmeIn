<template>
  <container>
    <template #heading>{{ password.app }}</template>

    <main>
      <icon
        :name="`app-${icon.name}`"
        :fill="icon.color"
        :view-box="icon.viewBox"
        size="50px"
      />

      <div class="account-identifier">
        {{ password.accountIdentifier }}
        <link-main :to="password.site">
          {{ password.site }}
        </link-main>
      </div>

      <div>
        <button-base @click="showQR" class="show-qr">
          <icon name="q-r" />
        </button-base>
      </div>

      <div class="tags" v-if="password.tags.length > 0">
        <chip-tag
          v-for="tag in password.tags"
          :key="tag.id"
          class="tags__tag"
          v-bind="{ tag }"
          no-remove-button
          invert
          clickable
          @click="gotToTag(tag)"
        />
      </div>

      <marked :content="password.note" class="note" />
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
import { toDataURL } from "qrcode"
import { ExtendVue, Icon, Password, Tag } from "~/@types"
import getIcon from "~/assets/utils/getIcon"

export default (Vue as ExtendVue<{ password: Password }>).extend({
  async asyncData({ $axios, params: { passwordId }, error }) {
    try {
      const { data: password } = await $axios.get(`/passwords/${passwordId}`)
      return { password }
    } catch (e) {
      return error(e.response.data)
    }
  },

  created() {
    this.icon = getIcon(this.password) as Icon
  },

  data() {
    return {
      icon: {} as Icon,
      isQRShown: false,
      qrCode: ""
    }
  },

  methods: {
    gotToTag(tag: Tag) {
      this.$router.push(`/vault?tag=${tag.id}`)
    },

    async showQR() {
      try {
        if (!this.qrCode) {
          const password = await this.$accessor.vault.decryptPassword(
            this.password.id
          )
          // @ts-ignore
          this.qrCode = await toDataURL(password, {
            errorCorrectionLevel: "H",
            margin: 1,
            color: {
              dark:
                this.$accessor.theme.currentTheme === "dark"
                  ? "#191b1f"
                  : "#ffffff",
              light:
                this.$accessor.theme.currentTheme === "dark"
                  ? "#ffffff"
                  : "#191b1f"
            }
          })
        }
        this.isQRShown = true
      } catch (e) {
        this.$notify.error(e.message)
      }
    },

    closeQR() {
      this.isQRShown = false
    },

    removeCachedQRCode() {
      this.qrCode = ""
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
  },

  watch: {
    "$store.state.theme.currentTheme": function removeCache() {
      this.removeCachedQRCode()
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

.note
  +br-md
  +pa(10px 20px)
  +clr-bg(secondary)
</style>
