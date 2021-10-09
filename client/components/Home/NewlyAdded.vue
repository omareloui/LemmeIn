<template>
  <div class="new-added">
    <div class="title">
      <h3 class="title__heading">Newly added</h3>
      <link-base class="title__link" to="/vault">Go to vault</link-base>
    </div>
    <div class="accounts">
      <account-preview
        v-for="acc in accounts"
        :key="acc.id"
        :account="acc"
        no-tags
        no-date
        include-strength
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Account } from "~/@types"

export default Vue.extend({
  computed: {
    accounts(): Account[] {
      return this.$accessor.vault.accounts
        .map(x => x)
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
        .slice(0, 15)
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.new-added
  .title
    +flex($space-between: true, $wrap: false, $gap: 5px)
    +w(100%)
    +mb(10px)
    +e(heading)
      align-self: baseline
      +fnt-4xl
    +e(link)
      +underline
      +italic
      +fnt-sm
      +clr-txt(main, $opacity: 0.8)
      +no-wrap
      align-self: baseline

  .accounts
    +grid($gap: 20px)
</style>
