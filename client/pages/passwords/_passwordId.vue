<template>
  <container has-padding-bottom>
    <template #heading>{{ password.app }}</template>
    <main>
      <icon
        :name="`app-${icon.name}`"
        :fill="icon.color"
        :view-box="icon.viewBox"
        size="50px"
      />

      <div v-if="password.accountIdentifier" class="account-identifier">
        {{ password.accountIdentifier }}
      </div>

      <link-new-tab v-if="password.site" :to="password.site">
        {{ password.site }}
      </link-new-tab>

      <div>
        <button-base @click="showQR" class="show-qr">
          <icon name="q-r" />
        </button-base>
      </div>

      <password-strength v-bind="{ decryptedPassword }" />

      <div class="tags" v-if="password.tags.length > 0">
        <link-base
          v-for="tag in password.tags"
          :key="tag.id"
          :to="`/vault?tags=${tag.id}`"
        >
          <chip-tag
            class="tags__tag"
            v-bind="{ tag }"
            no-remove-button
            invert
            clickable
          />
        </link-base>
      </div>

      <marked v-if="password.note" :content="password.note" class="note" />
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
import { ExtendVue, Icon, Password, PasswordStrength } from "~/@types"
import getIcon from "~/assets/utils/getIcon"

interface AsyncDataReturn {
  password: Password
  decryptedPassword?: string
}

export default (Vue as ExtendVue<AsyncDataReturn>).extend({
  async asyncData({ $axios, app, params: { passwordId }, error }) {
    try {
      const { data: password } = await $axios.get(`/passwords/${passwordId}`)
      const decryptedPassword = (await app.$accessor.vault.decryptPassword(
        password.id
      )) as string
      return { password, decryptedPassword }
    } catch (e) {
      return error(e.response.data)
    }
  },

  created() {
    this.loadIcon()
  },

  data() {
    return {
      icon: {} as Icon,
      isQRShown: false,
      qrCode: "",
      passwordStrength: null as PasswordStrength | null
    }
  },

  methods: {
    loadIcon() {
      this.icon = getIcon(this.password)
    },

    async createQR() {
      try {
        if (!this.qrCode) {
          // @ts-ignore
          this.qrCode = await toDataURL(this.password, {
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
      } catch (e) {
        this.$notify.error(e.message)
      }
    },

    showQR() {
      if (!this.qrCode) this.createQR()
      this.isQRShown = true
    },

    closeQR() {
      this.isQRShown = false
    },

    removeCachedQRCode() {
      this.qrCode = ""
    }

    // async deletePassword() {
    //   try {
    //     await this.$axios.delete(`/passwords/${this.$route.params.passwordId}`)
    //     this.$router.push("/passwords")
    //     this.$notify.success("Deleted password successfully")
    //   } catch (e) {
    //     throw new Error(e.response.data)
    //   }
    // }
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

.tags
  +flex($gap: 4px 10px, $center-v: true)
  +w(max 600px)
  +mx(auto)
</style>
