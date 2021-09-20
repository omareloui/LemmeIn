<template>
  <container has-padding-bottom class="password-page">
    <template #heading>{{ password.app }}</template>
    <main>
      <section
        class="primal-info"
        :class="{ 'primal-info--is-oauth': !notOAuth }"
      >
        <icon
          :name="`app-${icon.name}`"
          :fill="icon.color"
          :view-box="icon.viewBox"
          size="50px"
        />

        <!-- TODO: add last used for not oauth passwords -->
        <div class="account-info">
          <div v-if="password.accountIdentifier" class="account-identifier">
            {{ password.accountIdentifier }}
            <icon
              name="copy"
              clickable
              @click="$copy(password.accountIdentifier)"
              @keyup:enter="$copy(password.accountIdentifier)"
              @keyup:space="$copy(password.accountIdentifier)"
              aria-label="copy account identifier"
              size="15px"
              focusable
            />
          </div>

          <div class="site" v-if="password.site">
            <link-new-tab :to="password.site">
              {{ password.site }}
            </link-new-tab>
          </div>
        </div>

        <button-base v-if="notOAuth" @click="showQR" class="show-qr">
          <icon name="q-r" size="40px" />
        </button-base>
      </section>

      <section v-if="notOAuth" class="password">
        <password-reveal
          class="password-reveal"
          :password="password.decryptedPassword"
        />
        <icon
          name="copy"
          class="copy"
          clickable
          focusable
          size="35px"
          aria-label="copy password"
          @click="$copy(password.decryptedPassword)"
        />
        <password-strength
          class="strength"
          line-height="10px"
          hide-score-text
          :decrypted-password="password.decryptedPassword"
        />
      </section>

      <section v-if="!notOAuth" class="oauth">
        <h3>Connected with</h3>
        <password-preview
          :password="password.password"
          no-date
          no-tags
          include-strength
        />
      </section>

      <section class="tags" v-if="password.tags.length > 0">
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
      </section>

      <section class="note">
        <marked v-if="password.note" :content="password.note" class="note" />
      </section>
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
import { ExtendVue, Icon, Password } from "~/@types"
import getIcon from "~/assets/utils/getIcon"

interface AsyncDataReturn {
  password: Password
}

export default (Vue as ExtendVue<AsyncDataReturn>).extend({
  async asyncData({ app, params: { passwordId }, error }) {
    try {
      const password = await app.$accessor.vault.getPassword(passwordId)
      return { password }
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
      qrCode: ""
    }
  },

  computed: {
    notOAuth(): boolean {
      return !this.password.password
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
          this.qrCode = await toDataURL(this.password.decryptedPassword, {
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

.password-page

  section.primal-info
    +mt(10px)
    +grid(50px 1fr 60px, $gap: 10px, $center-v: true)

    .account-info
      +w(max 100%)
      overflow: hidden
      .account-identifier
        +no-wrap
        +mb(8px)

      .site
        +mx(10px)
        ::v-deep
          .link
            +fnt-xs
            +py(5px)
            > i
              right: 2px
              top: 2px

    .show-qr
      justify-self: end
      align-self: center
      > i
        +block

    +m(is-oauth)
      grid-template-columns: 50px 1fr

  section.password
    +my(20px)
    +grid($areas: "password copy" "strength strength", $columns: 1fr 50px, $gap: 15px 20px)
    .password-reveal
      grid-area: password
      overflow: hidden
      +w(max 100%)
    .copy
      grid-area: copy
      place-self: center
    .strength
      grid-area: strength

  section.oauth
    h3
      +my(5px)

  section.tags
    +flex($gap: 10px 15px, $center-v: true)
    +w(max 600px)
    +mx(auto)
    +my(30px)

  section.note
    > :first-child
      +br-xl
      +pa(20px)
      +clr-bg(secondary)

  .dialogue-content
    +pos-r
    +grid($center: true)
    +pa(30px)
    img
      +size(50vmin)
      +br-xl
</style>
