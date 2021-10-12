<template>
  <container padding-bottom class="account-page">
    <template #heading>{{ account.app }}</template>
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
          <div v-if="account.accountIdentifier" class="account-identifier">
            {{ account.accountIdentifier }}
            <icon
              name="copy"
              clickable
              @click="copyAccId"
              @keyup:enter="copyAccId"
              @keyup:space="copyAccId"
              aria-label="copy account identifier"
              size="15px"
              focusable
            />
          </div>

          <div class="site" v-if="account.site">
            <link-new-tab :to="account.site"> {{ account.site }} </link-new-tab>
          </div>
        </div>

        <button-base v-if="notOAuth" @click="showQR" class="show-qr">
          <icon name="q-r" size="40px" />
        </button-base>
      </section>

      <section v-if="notOAuth" class="password">
        <password-reveal
          class="password-reveal"
          :password="account.decryptedPassword"
        />
        <icon
          name="copy"
          class="copy"
          clickable
          focusable
          size="35px"
          aria-label="copy password"
          @click="copy"
        />
        <password-strength
          class="strength"
          line-height="10px"
          hide-score-text
          :decrypted-password="account.decryptedPassword"
        />
      </section>

      <section v-if="!notOAuth" class="oauth">
        <h3>Connected with</h3>
        <account-preview
          :account="account.password"
          no-date
          no-tags
          include-strength
        />
      </section>

      <section class="tags" v-if="account.tags.length > 0">
        <link-base
          v-for="tag in account.tags"
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

      <section class="note" v-if="account.note">
        <marked :content="account.note" class="note" />
      </section>

      <section class="make-better" v-if="notOAuth && suggestions.length > 0">
        <h3>How to make the password better</h3>
        <ul class="suggestions">
          <li v-for="suggestion in suggestions" :key="suggestion">
            {{ suggestion }}
          </li>
        </ul>
      </section>

      <section class="duplicated" v-if="notOAuth && duplications.length > 0">
        <h3>Duplicated with</h3>
        <div class="duplications">
          <account-preview
            v-for="duplication in duplications"
            :key="duplication.id"
            :account="duplication"
            no-date
            no-tags
            include-strength
          />
        </div>
      </section>

      <section class="edit-buttons">
        <button-main large block color="info" @click="showUpdateAccount">
          Edit
        </button-main>
        <button-main large block color="danger" @click="deleteAccount">
          Delete
        </button-main>
      </section>
    </main>

    <dialogue :is-shown="isQRShown" @close="closeQR">
      <div class="dialogue-content">
        <qr :text="account.decryptedPassword" />
      </div>
    </dialogue>
    <dialogue :is-shown="isUpdateAccountShown" @close="closeUpdateAccount">
      <account-edit
        v-bind="account"
        :tags="account.tags.map(x => x.id)"
        @edit-account="updateAccountData"
        @close-dialogue="closeUpdateAccount"
      />
    </dialogue>
  </container>
</template>

<script lang="ts">
import Vue from "vue"
import { ExtendVue, Icon, Account } from "~/@types"
import getIcon from "~/assets/utils/getIcon"

interface AsyncDataReturn {
  account: Account
}

export default (Vue as ExtendVue<AsyncDataReturn>).extend({
  async asyncData({ app, params: { accountId }, error }) {
    try {
      const account = await app.$accessor.vault.getAccount(accountId)
      return { account }
    } catch (e) {
      return error(e.response.data)
    }
  },

  created() {
    this.loadIcon()
  },

  data: () => ({
    icon: {} as Icon,
    isQRShown: false,
    isUpdateAccountShown: false
  }),

  computed: {
    notOAuth(): boolean {
      return !this.account.password
    },

    suggestions(): string[] | null {
      if (!this.notOAuth) return null
      return this.$getPasswordStrength(this.account.decryptedPassword!)
        .suggestions
    },

    duplications(): Account[] | null {
      if (!this.notOAuth) return null
      return this.$accessor.analyze.duplicated.accounts.filter(
        x =>
          x.id !== this.account.id &&
          x.decryptedPassword === this.account.decryptedPassword
      )
    }
  },

  methods: {
    copyAccId() {
      const accId = this.account.accountIdentifier
      if (!accId) this.$notify.error("No account identifier")
      else this.$copy(accId)
    },

    copy() {
      this.$accessor.vault.copy(this.account.id)
    },

    loadIcon() {
      this.icon = getIcon(this.account)
    },

    showQR() {
      this.isQRShown = true
    },

    closeQR() {
      this.isQRShown = false
    },

    showUpdateAccount() {
      this.isUpdateAccountShown = true
    },

    closeUpdateAccount() {
      this.isUpdateAccountShown = false
    },

    async updateAccountData(newAccount: Account) {
      this.account = await this.$accessor.vault.getAccount(newAccount.id)
    },

    deleteAccount() {
      this.$accessor.vault.deleteAccount({
        accountId: this.account.id,
        accountName: this.account.app
      })
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.account-page

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
    +mb(10px)
    > :first-child
      +br-xl
      +pa(20px)
      +clr-bg(secondary)

  section.edit-buttons
    +grid(1fr, $gap: 10px, $center: true)
    +my(30px)
    +lt-mobile
      grid-template-columns: 1fr 1fr

  section.make-better
    .suggestions
      +ml(40px)
      +mt(10px)
      +fnt-lg

  section.duplicated
    .duplications
      +grid($gap: 20px)
      +mt(10px)

  .dialogue-content
    +pos-r
    +grid($center: true)
    +pa(30px)
    img
      +size(50vmin)
      +br-xl
</style>
